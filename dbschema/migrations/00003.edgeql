CREATE MIGRATION m1ygzuxvdweqep654e5mxhumfdekktdvhyxedd3nflkbpvtidom4oq
    ONTO m1fnqvwr7esacpmznbhzlsk77b3stsopctidybjrtkgakiug5n6uhq
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY handle -> std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.handle);
      CREATE PROPERTY authId -> std::str;
      CREATE REQUIRED PROPERTY createdAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
      CREATE PROPERTY description -> std::str;
      CREATE PROPERTY name -> std::str;
      CREATE REQUIRED PROPERTY updatedAt -> cal::local_datetime {
          SET default := (cal::to_local_datetime(std::datetime_current(), 'UTC'));
      };
  };
};
