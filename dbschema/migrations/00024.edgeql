CREATE MIGRATION m145jl2r4iadgpuwglv5lass5umytdfsiikxszp23vwer32kseznaq
    ONTO m1aqr7n3czdxzcbpjcc4pmol5yddxsyvy5fb7nee22pjgol5r7kxya
{
  ALTER ABSTRACT LINK has::createdAndUpdatedAt {
      ALTER PROPERTY created_at {
          RENAME TO createdAt;
      };
  };
  ALTER ABSTRACT LINK has::createdAndUpdatedAt {
      ALTER PROPERTY updated_at {
          RENAME TO updatedAt;
      };
  };
  ALTER TYPE has::CreatedAndUpdatedAt {
      ALTER PROPERTY created_at {
          RENAME TO createdAt;
      };
  };
  ALTER TYPE has::CreatedAndUpdatedAt {
      ALTER PROPERTY updated_at {
          RENAME TO updatedAt;
      };
  };
};
