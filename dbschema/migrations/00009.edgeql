CREATE MIGRATION m15ykjnv5p5ubr645d7j5gt3d3mhoxrgh7yqafpbx4sdpwuz35nyvq
    ONTO m1mto6vwpteqgxnorrw4rfkrlv3jjny5bixjsugd5o3w7l3pm26k3a
{
  ALTER TYPE default::Post {
      ALTER LINK repliedToPost {
          RENAME TO replyToPost;
      };
  };
};
