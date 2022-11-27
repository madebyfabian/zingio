CREATE MIGRATION m1gxsl5wbx4bzhglg5v46sqgso54gjio5s54vl7gkdg3fhbrquhbaq
    ONTO initial
{
  CREATE FUTURE nonrecursive_access_policies;
  CREATE TYPE default::Person {
      CREATE REQUIRED PROPERTY name -> std::str;
  };
  CREATE TYPE default::Movie {
      CREATE MULTI LINK actors -> default::Person;
      CREATE PROPERTY title -> std::str;
  };
};
