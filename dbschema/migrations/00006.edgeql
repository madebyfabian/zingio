CREATE MIGRATION m1e5z6q4tgdjvdws723xjfyv5j2m3g7fpanbxzfqvnjua265ysu3aa
    ONTO m1whnyyimykpzj3kpvf6zyvixze7ftscrf7txgz7p2xr4ktgc5mzza
{
  ALTER TYPE default::Post {
      ALTER PROPERTY isDeleted {
          SET REQUIRED USING (false);
      };
  };
  ALTER TYPE default::PostReaction {
      DROP LINK post;
  };
};
