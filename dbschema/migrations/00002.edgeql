CREATE MIGRATION m1fnqvwr7esacpmznbhzlsk77b3stsopctidybjrtkgakiug5n6uhq
    ONTO m1gxsl5wbx4bzhglg5v46sqgso54gjio5s54vl7gkdg3fhbrquhbaq
{
  ALTER TYPE default::Movie {
      ALTER PROPERTY title {
          SET REQUIRED USING ('Untitled');
      };
  };
};
