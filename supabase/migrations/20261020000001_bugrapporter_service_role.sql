-- Service_role saknade grund-rättigheter på bug_reports - "yarn buggar" gav
-- "permission denied for table bug_reports". BYPASSRLS (som service_role har) hoppar bara över
-- radfiltren (policyerna i 20261020000000_bugrapporter.sql), inte grund-GRANT-rättigheterna på
-- själva tabellen, som måste sättas separat.
grant all on public.bug_reports to service_role;
