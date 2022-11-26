CREATE MIGRATION m17id53wcmkjusuwwwvacpzjb3yu75fxsnguvhdntayqobagot7fua
    ONTO m1fxzh5ax2oa242y7g3l2umuh5obofuw3rmofv7azu4kbtnvya7c3a
{
  ALTER TYPE default::PostReaction {
      ALTER LINK user {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
