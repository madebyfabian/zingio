CREATE MIGRATION m1cocef47j7opxyndiyfa3jhqdyf5jdh2zblmvpmzrhww4t7ck5f2q
    ONTO m15ykjnv5p5ubr645d7j5gt3d3mhoxrgh7yqafpbx4sdpwuz35nyvq
{
  ALTER TYPE default::User {
      ALTER LINK followingUsers {
          CREATE PROPERTY followingSince -> cal::local_datetime {
              SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
          };
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK posts := (.<authorUser[IS default::Post]);
  };
};
