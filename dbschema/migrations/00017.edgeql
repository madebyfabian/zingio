CREATE MIGRATION m1g4nkp4k5kdp5aj6gbyamsd3ufcd5glv3qqvsskbolaknsbb5jqdq
    ONTO m1d727tf6vd7rhqzckmuqf3c5bzcg2gcazfugno5awj3ojcxvbzdeq
{
  ALTER TYPE default::Bookmark {
      ALTER LINK bookmarkFolder {
          RESET OPTIONALITY;
      };
  };
};
