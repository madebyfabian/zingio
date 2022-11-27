CREATE MIGRATION m14bf4sbohawopapxmt67k3xqbidlab7hw67w7ghc67awb2bwm25qa
    ONTO m145jl2r4iadgpuwglv5lass5umytdfsiikxszp23vwer32kseznaq
{
  ALTER TYPE default::Post {
      CREATE MULTI LINK allPostReplies := (.<replyToPost[IS default::Post]);
  };
};
