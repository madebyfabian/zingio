CREATE MIGRATION m1mto6vwpteqgxnorrw4rfkrlv3jjny5bixjsugd5o3w7l3pm26k3a
    ONTO m1cka3cfmyl4mxqh3lear5fvooqu5kn6va3qalxgm4km3sv6zjxuhq
{
  ALTER TYPE default::Post {
      DROP LINK commentPosts;
  };
  ALTER TYPE default::Post {
      CREATE LINK repliedToPost -> default::Post;
  };
};
