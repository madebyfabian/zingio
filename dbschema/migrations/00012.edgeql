CREATE MIGRATION m1j2jip6tfyrrhln6cmwqe5xdrglrgdi3m2hkc2vpthfkoezykit2q
    ONTO m1saykm5jyf375olwmhs2nen2ctpl4o2b63cydt64rggfzwfayfe2a
{
  ALTER TYPE default::User {
      ALTER LINK isFollowedBy {
          RENAME TO isFollowedByUsers;
      };
  };
};
