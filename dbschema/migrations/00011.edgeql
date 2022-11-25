CREATE MIGRATION m1saykm5jyf375olwmhs2nen2ctpl4o2b63cydt64rggfzwfayfe2a
    ONTO m1cocef47j7opxyndiyfa3jhqdyf5jdh2zblmvpmzrhww4t7ck5f2q
{
  ALTER TYPE default::User {
      CREATE MULTI LINK isFollowedBy := (.<followingUsers[IS default::User]);
  };
};
