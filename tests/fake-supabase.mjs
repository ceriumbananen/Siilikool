/* Låtsas-Supabase för tester (tests/e2e/*.mjs): en liten HTTP-server som talar det som
   @supabase/supabase-js använder - GoTrue (/auth/v1) och PostgREST (/rest/v1, /rest/v1/rpc) - mot
   en riktig Postgres i minnet (PGlite) med projektets egna migreringar och RLS. Så testas appen mot
   samma behörigheter som i produktion, utan att röra det riktiga projektet.

   Kör: node tests/fake-supabase.mjs [port]   (standard 54321)
   POST /debug/sql {sql, params} kör SQL som superanvändare (för testerna). Inloggningskoden i
   "mejlet" är alltid 123456. FAKE_CONFIRM=1 kräver bekräftad e-post vid registrering. */
import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";

const PORT = Number(process.argv[2] || process.env.PORT || 54321);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIGRATIONS = path.join(ROOT, "supabase/migrations");

const db = new PGlite({ extensions: { pgcrypto } });
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema auth; create schema extensions;
  create table auth.users (id uuid primary key, email text unique, is_anonymous boolean default false);
  create function auth.jwt() returns jsonb language sql stable as
    $$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb) $$;
  create function auth.uid() returns uuid language sql stable as $$ select nullif(auth.jwt() ->> 'sub', '')::uuid $$;
  grant usage on schema public, auth, extensions to anon, authenticated;
  grant execute on all functions in schema auth to anon, authenticated;
`);
for (const f of fs.readdirSync(MIGRATIONS).sort()) await db.exec(fs.readFileSync(path.join(MIGRATIONS, f), "utf8"));

/* ---------- GoTrue ---------- */
const users = new Map(); /* id -> {id, email, password, is_anonymous, confirmed} */
const refreshTokens = new Map(); /* token -> {userId, sessionId} */
const b64 = o => Buffer.from(JSON.stringify(o)).toString("base64url");

function userJson(u) {
  return {
    id: u.id,
    aud: "authenticated",
    role: "authenticated",
    email: u.email || "",
    is_anonymous: !!u.is_anonymous,
    email_confirmed_at: u.confirmed ? new Date().toISOString() : null,
    app_metadata: { provider: u.is_anonymous ? "anonymous" : "email" },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
  };
}
function sessionFor(u, sessionId = crypto.randomUUID()) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const claims = {
    sub: u.id,
    role: "authenticated",
    aud: "authenticated",
    email: u.email || "",
    is_anonymous: !!u.is_anonymous,
    session_id: sessionId,
    exp,
  };
  const refresh = crypto.randomBytes(16).toString("hex");
  refreshTokens.set(refresh, { userId: u.id, sessionId });
  return {
    access_token: `${b64({ alg: "HS256", typ: "JWT" })}.${b64(claims)}.sig`,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: exp,
    refresh_token: refresh,
    user: userJson(u),
  };
}
async function createUser(email, password, anonymous = false) {
  const u = {
    id: crypto.randomUUID(),
    email: email || null,
    password,
    is_anonymous: anonymous,
    confirmed: !process.env.FAKE_CONFIRM,
  };
  users.set(u.id, u);
  await db.query("insert into auth.users (id, email, is_anonymous) values ($1, $2, $3)", [u.id, u.email, anonymous]);
  return u;
}
const byEmail = email =>
  [...users.values()].find(u => u.email && u.email.toLowerCase() === String(email).toLowerCase());
function claimsOf(req) {
  const t = (req.headers.authorization || "").replace(/^Bearer /i, "");
  try {
    const c = JSON.parse(Buffer.from(t.split(".")[1], "base64url").toString());
    return c.sub && users.has(c.sub) ? c : null;
  } catch {
    return null;
  }
}
const authErr = (status, msg, code = "bad_request") => [
  status,
  { code, error_code: code, msg, message: msg, error_description: msg },
];

async function auth(req, url, body) {
  const p = url.pathname.replace("/auth/v1", "");
  if (p === "/signup" && req.method === "POST") {
    if (!body.email) return [200, sessionFor(await createUser(null, null, true))];
    if (byEmail(body.email)) return authErr(422, "User already registered", "user_already_exists");
    if (!body.password || body.password.length < 6)
      return authErr(422, "Password should be at least 6 characters.", "weak_password");
    const u = await createUser(body.email, body.password);
    return [200, u.confirmed ? sessionFor(u) : userJson(u)];
  }
  if (p === "/token") {
    const grant = url.searchParams.get("grant_type");
    if (grant === "password") {
      const u = byEmail(body.email);
      if (!u || u.password !== body.password) return authErr(400, "Invalid login credentials", "invalid_credentials");
      if (!u.confirmed) return authErr(400, "Email not confirmed", "email_not_confirmed");
      return [200, sessionFor(u)];
    }
    if (grant === "refresh_token") {
      const r = refreshTokens.get(body.refresh_token);
      if (!r || !users.has(r.userId)) return authErr(400, "Invalid Refresh Token", "refresh_token_not_found");
      return [200, sessionFor(users.get(r.userId), r.sessionId)];
    }
  }
  if (p === "/otp") return [200, {}];
  if (p === "/recover") return [200, {}];
  if (p === "/verify" && req.method === "POST") {
    if (String(body.token).trim() !== "123456") return authErr(403, "Token has expired or is invalid", "otp_expired");
    const u = byEmail(body.email) || (await createUser(body.email, null));
    u.confirmed = true;
    return [200, sessionFor(u)];
  }
  if (p === "/logout") return [204, null];
  if (p === "/user") {
    const c = claimsOf(req);
    if (!c) return authErr(401, "invalid JWT", "bad_jwt");
    const u = users.get(c.sub);
    if (req.method === "PUT" && body.password) u.password = body.password;
    return [200, userJson(u)];
  }
  return authErr(404, "not found: " + p, "not_found");
}

/* ---------- PostgREST ---------- */
const ident = s => '"' + String(s).replace(/"/g, '""') + '"';
/* select=id, kind, stars:data->stars, name:data->>name */
function selectList(sel) {
  if (!sel || sel === "*") return "*";
  return sel
    .split(",")
    .map(x => x.trim())
    .filter(Boolean)
    .map(x => {
      const [alias, expr] = x.includes(":") ? x.split(":") : [null, x];
      const m = expr.match(/^(\w+)(?:(->>?)(\w+))?$/);
      if (!m) throw new Error("select stöds inte: " + x);
      const col = m[2] ? `${ident(m[1])}${m[2]}'${m[3]}'` : ident(m[1]);
      return alias || m[2] ? `${col} as ${ident(alias || m[3])}` : col;
    })
    .join(", ");
}
function where(url, params) {
  const parts = [];
  for (const [k, v] of url.searchParams) {
    if (["select", "order", "limit", "offset", "on_conflict", "columns"].includes(k)) continue;
    const i = v.indexOf(".");
    const op = v.slice(0, i),
      val = v.slice(i + 1);
    if (op === "eq") parts.push(`${ident(k)}::text = $${params.push(val)}`);
    else if (op === "neq") parts.push(`${ident(k)}::text <> $${params.push(val)}`);
    else if (op === "is") parts.push(`${ident(k)} is ${val === "null" ? "null" : val === "true" ? "true" : "false"}`);
    else if (op === "in") {
      const list = val
        .replace(/^\(|\)$/g, "")
        .split(",")
        .map(x => x.replace(/^"|"$/g, ""));
      parts.push(`${ident(k)}::text = any($${params.push(list)}::text[])`);
    } else if (op === "gt" || op === "lt" || op === "gte" || op === "lte") {
      const sym = { gt: ">", lt: "<", gte: ">=", lte: "<=" }[op];
      parts.push(`${ident(k)} ${sym} $${params.push(val)}`);
    } else throw new Error("filter stöds inte: " + k + "=" + v);
  }
  return parts.length ? " where " + parts.join(" and ") : "";
}
function orderLimit(url) {
  let s = "";
  const o = url.searchParams.get("order");
  if (o)
    s +=
      " order by " +
      o
        .split(",")
        .map(x => {
          const [col, dir, nulls] = x.split(".");
          return `${ident(col)} ${dir === "desc" ? "desc" : "asc"}${nulls ? (nulls === "nullsfirst" ? " nulls first" : " nulls last") : ""}`;
        })
        .join(", ");
  const l = url.searchParams.get("limit");
  if (l) s += ` limit ${Number(l)}`;
  return s;
}
/* kör SQL som den inloggade (eller anon), med RLS */
async function asUser(claims, fn) {
  return db.transaction(async tx => {
    await tx.query("select set_config('request.jwt.claims', $1, true)", [claims ? JSON.stringify(claims) : ""]);
    await tx.exec(claims ? "set local role authenticated" : "set local role anon");
    return fn(tx);
  });
}
function pgErr(e) {
  const code = e.code || "XX000";
  const status = code === "42501" ? 403 : code === "P0002" ? 404 : code === "23505" ? 409 : 400;
  return [status, { code, message: e.message, details: e.detail || null, hint: e.hint || null }];
}

async function rest(req, url, body) {
  const claims = claimsOf(req);
  const p = url.pathname.replace("/rest/v1/", "");
  const wantsObject = /vnd\.pgrst\.object/.test(req.headers.accept || "");
  const returnRep = /return=representation/.test(req.headers.prefer || "");
  try {
    if (p.startsWith("rpc/")) {
      const fn = p.slice(4);
      const args = Object.entries(body || {});
      const params = args.map(([, v]) => (v !== null && typeof v === "object" ? JSON.stringify(v) : v));
      const sql = `select public.${ident(fn)}(${args.map(([k], i) => `${ident(k)} => $${i + 1}`).join(", ")}) as r`;
      const r = await asUser(claims, tx => tx.query(sql, params));
      return [200, r.rows[0]?.r ?? null];
    }
    const table = `public.${ident(p)}`;
    const params = [];
    const sel = selectList(url.searchParams.get("select"));
    let rows;
    if (req.method === "GET") {
      rows = (
        await asUser(claims, tx =>
          tx.query(`select ${sel} from ${table}${where(url, params)}${orderLimit(url)}`, params),
        )
      ).rows;
    } else if (req.method === "POST") {
      const list = Array.isArray(body) ? body : [body];
      rows = await asUser(claims, async tx => {
        const out = [];
        for (const r of list) {
          const cols = Object.keys(r);
          const ps = cols.map(c => (r[c] !== null && typeof r[c] === "object" ? JSON.stringify(r[c]) : r[c]));
          const q = `insert into ${table} (${cols.map(ident).join(", ")}) values (${cols.map((_, i) => `$${i + 1}`).join(", ")}) returning ${sel}`;
          out.push(...(await tx.query(q, ps)).rows);
        }
        return out;
      });
    } else if (req.method === "PATCH") {
      const cols = Object.keys(body);
      cols.forEach(c =>
        params.push(body[c] !== null && typeof body[c] === "object" ? JSON.stringify(body[c]) : body[c]),
      );
      const set = cols.map((c, i) => `${ident(c)} = $${i + 1}`).join(", ");
      rows = (
        await asUser(claims, tx => tx.query(`update ${table} set ${set}${where(url, params)} returning ${sel}`, params))
      ).rows;
    } else if (req.method === "DELETE") {
      rows = (
        await asUser(claims, tx => tx.query(`delete from ${table}${where(url, params)} returning ${sel}`, params))
      ).rows;
    } else return [405, { message: "method" }];
    if (req.method !== "GET" && !returnRep && !wantsObject) return [204, null];
    if (wantsObject) {
      if (rows.length !== 1)
        return [
          406,
          {
            code: "PGRST116",
            message: "JSON object requested, multiple (or no) rows returned",
            details: `The result contains ${rows.length} rows`,
            hint: null,
          },
        ];
      return [200, rows[0]];
    }
    return [200, rows];
  } catch (e) {
    return pgErr(e);
  }
}

/* ---------- server ---------- */
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const cors = {
      "access-control-allow-origin": req.headers.origin || "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      "access-control-expose-headers": "*",
    };
    if (req.method === "OPTIONS") return res.writeHead(204, cors).end();
    let raw = "";
    for await (const c of req) raw += c;
    let body = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      /* tom eller trasig - behandlas som {} */
    }
    let out;
    try {
      if (url.pathname === "/debug/sql") {
        const r = await db.query(body.sql, body.params || []);
        out = [200, r.rows];
      } else if (url.pathname === "/debug/users") out = [200, [...users.values()].map(userJson)];
      else if (url.pathname.startsWith("/auth/v1")) out = await auth(req, url, body);
      else if (url.pathname.startsWith("/rest/v1/")) out = await rest(req, url, body);
      else out = [404, { message: "not found" }];
    } catch (e) {
      out = [500, { message: String(e.message || e) }];
    }
    const [status, data] = out;
    res.writeHead(status, { ...cors, "content-type": "application/json" });
    res.end(status === 204 || data === undefined ? "" : JSON.stringify(data));
  })
  .listen(PORT, () => console.log(`låtsas-Supabase på http://localhost:${PORT}`));
