CREATE MIGRATION m1aqr7n3czdxzcbpjcc4pmol5yddxsyvy5fb7nee22pjgol5r7kxya
    ONTO m17id53wcmkjusuwwwvacpzjb3yu75fxsnguvhdntayqobagot7fua
{
  CREATE MODULE has IF NOT EXISTS;
  CREATE ABSTRACT LINK has::createdAndUpdatedAt {
      CREATE PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE PROPERTY updated_at -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::User {
      DROP PROPERTY createdAt;
  };
  ALTER TYPE default::User {
      DROP PROPERTY updatedAt;
  };
  CREATE ABSTRACT TYPE has::CreatedAndUpdatedAt {
      CREATE PROPERTY created_at -> std::datetime {
          SET default := (std::datetime_current());
          SET readonly := true;
      };
      CREATE PROPERTY updated_at -> std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::User EXTENDING has::CreatedAndUpdatedAt LAST;
  ALTER TYPE default::User {
      ALTER LINK followingUsers {
          DROP PROPERTY followingSince;
          EXTENDING has::createdAndUpdatedAt LAST;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK followingUsers {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::Bookmark {
      DROP PROPERTY createdAt;
  };
  ALTER TYPE default::Bookmark {
      DROP PROPERTY updatedAt;
      EXTENDING has::CreatedAndUpdatedAt LAST;
  };
  ALTER TYPE default::BookmarkFolder {
      DROP PROPERTY createdAt;
      DROP PROPERTY updatedAt;
  };
  ALTER TYPE default::Post {
      DROP PROPERTY createdAt;
  };
  ALTER TYPE default::Post {
      DROP PROPERTY updatedAt;
      EXTENDING has::CreatedAndUpdatedAt LAST;
  };
  ALTER TYPE default::Post {
      ALTER LINK replyToPost {
          ON TARGET DELETE ALLOW;
      };
  };
  ALTER TYPE default::PostReaction {
      DROP PROPERTY createdAt;
  };
  ALTER TYPE default::PostReaction {
      DROP PROPERTY updatedAt;
      EXTENDING has::CreatedAndUpdatedAt LAST;
  };
};
