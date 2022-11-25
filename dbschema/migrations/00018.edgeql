CREATE MIGRATION m1wvvqcknpzqgsv2ewd7nlosulubqvrmwtqwmv4eguyigofjy6hlma
    ONTO m1g4nkp4k5kdp5aj6gbyamsd3ufcd5glv3qqvsskbolaknsbb5jqdq
{
  ALTER TYPE default::Post {
      ALTER LINK postReactions {
          ON SOURCE DELETE DELETE TARGET;
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
