CREATE MIGRATION m1s4z7lbtj2aiybe4vesqlhherxve7zohp3uveeexc35ohml2qhkga
    ONTO m14bf4sbohawopapxmt67k3xqbidlab7hw67w7ghc67awb2bwm25qa
{
  ALTER TYPE default::Bookmark {
      ALTER LINK post {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
