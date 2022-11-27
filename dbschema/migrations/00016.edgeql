CREATE MIGRATION m1d727tf6vd7rhqzckmuqf3c5bzcg2gcazfugno5awj3ojcxvbzdeq
    ONTO m1ufn3cvbxhu6s42jo4v5czregn7mn6i66m3tpyyknbm5qisvb3szq
{
  ALTER TYPE default::User {
      ALTER PROPERTY authId {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
