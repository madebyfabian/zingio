CREATE MIGRATION m134gsxrnb7tsb6rwuv2kym2uuxwcacdhzwi2kdi5qkaobyn3ijz3a
    ONTO m1ygzuxvdweqep654e5mxhumfdekktdvhyxedd3nflkbpvtidom4oq
{
  ALTER TYPE default::User {
      CREATE MULTI LINK isFollowingUsers -> default::User;
  };
};
