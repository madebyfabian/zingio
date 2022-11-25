CREATE MIGRATION m1om5qfjlnnaxoym3fnxx6k7k4sio73icrp7dbv7gq3vakad3rcfva
    ONTO m1efs6dqb2rugf7tnnrv5gts4zdgtuo2q5juse37leb23zp5zyvbra
{
  CREATE TYPE default::Bookmark {
      CREATE REQUIRED LINK post -> default::Post;
      CREATE REQUIRED LINK user -> default::User;
      CREATE REQUIRED PROPERTY createdAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE REQUIRED PROPERTY updatedAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
  CREATE TYPE default::BookmarkFolder {
      CREATE REQUIRED LINK user -> default::User;
      CREATE REQUIRED PROPERTY createdAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE REQUIRED PROPERTY icon -> std::str;
      CREATE REQUIRED PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY updatedAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
  ALTER TYPE default::Bookmark {
      CREATE REQUIRED LINK bookmarkFolder -> default::BookmarkFolder;
  };
  ALTER TYPE default::BookmarkFolder {
      CREATE MULTI LINK hasBookmarks := (.<bookmarkFolder[IS default::Bookmark]);
  };
};
