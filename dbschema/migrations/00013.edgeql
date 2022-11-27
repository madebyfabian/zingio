CREATE MIGRATION m1efs6dqb2rugf7tnnrv5gts4zdgtuo2q5juse37leb23zp5zyvbra
    ONTO m1j2jip6tfyrrhln6cmwqe5xdrglrgdi3m2hkc2vpthfkoezykit2q
{
  ALTER TYPE default::User {
      CREATE INDEX ON (.authId);
  };
};
