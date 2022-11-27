CREATE MIGRATION m1fxzh5ax2oa242y7g3l2umuh5obofuw3rmofv7azu4kbtnvya7c3a
    ONTO m1bbl5flco6q64y5oqp2xjj7djhs3nr4yuttkk4rh5m5mppnh7jaha
{
  ALTER TYPE default::PostReaction {
      CREATE LINK post -> default::Post {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE CONSTRAINT std::exclusive ON ((.user, .post));
  };
  ALTER TYPE default::Post {
      CREATE MULTI LINK allPostReactions := (.<post[IS default::PostReaction]);
      DROP LINK postReactions;
  };
};
