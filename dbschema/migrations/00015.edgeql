CREATE MIGRATION m1ufn3cvbxhu6s42jo4v5czregn7mn6i66m3tpyyknbm5qisvb3szq
    ONTO m1om5qfjlnnaxoym3fnxx6k7k4sio73icrp7dbv7gq3vakad3rcfva
{
  ALTER TYPE default::BookmarkFolder {
      ALTER PROPERTY icon {
          RESET OPTIONALITY;
      };
  };
};
