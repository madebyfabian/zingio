CREATE MIGRATION m1whnyyimykpzj3kpvf6zyvixze7ftscrf7txgz7p2xr4ktgc5mzza
    ONTO m134gsxrnb7tsb6rwuv2kym2uuxwcacdhzwi2kdi5qkaobyn3ijz3a
{
  CREATE TYPE default::Post {
      CREATE REQUIRED LINK authorUser -> default::User;
      CREATE MULTI LINK commentPosts -> default::Post;
      CREATE REQUIRED PROPERTY content -> std::str;
      CREATE REQUIRED PROPERTY createdAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE PROPERTY isDeleted -> std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY updatedAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
  CREATE TYPE default::PostReaction {
      CREATE REQUIRED LINK post -> default::Post;
      CREATE REQUIRED LINK user -> default::User;
      CREATE REQUIRED PROPERTY createdAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE REQUIRED PROPERTY updatedAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
  ALTER TYPE default::Post {
      CREATE MULTI LINK postReactions -> default::PostReaction;
  };
  ALTER TYPE default::User {
      ALTER LINK isFollowingUsers {
          RENAME TO followingUsers;
      };
  };
};
