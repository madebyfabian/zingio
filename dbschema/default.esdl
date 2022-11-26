module default {
  type User extending has::CreatedAndUpdatedAt {
    required property handle -> str {
      constraint exclusive;
    };
    property name -> str;
    property authId -> str {
      constraint exclusive;
    }
    property description -> str;
    multi link followingUsers extending has::createdAndUpdatedAt -> User {
      on target delete allow;
    };

    # Backlinks, meaning that the data is stored on the target, not here.
    multi link posts := .<authorUser[is Post];
    multi link isFollowedByUsers := .<followingUsers[is User];

    # Indexes
    index on (.handle);
    index on (.authId);
  }

  type Post extending has::CreatedAndUpdatedAt {
    required property content -> str;
    required property isDeleted -> bool {
      default := false;
    }
    link replyToPost -> Post {
      on target delete allow;
    };
    required link authorUser -> User;

    # Backlinks, meaning that the data is stored on the target, not here.
    multi link allPostReactions := .<post[is PostReaction];
    multi link allPostReplies := .<replyToPost[is Post];
  }

  type PostReaction extending has::CreatedAndUpdatedAt {
    required link user -> User {
      on target delete delete source;
    };
    link post -> Post {
      on target delete delete source
    };

    constraint exclusive on ((.user, .post));
  }

  type Bookmark extending has::CreatedAndUpdatedAt {
    required link user -> User;
    required link post -> Post {
      on target delete delete source;
    };
    link bookmarkFolder -> BookmarkFolder;
  }

  type BookmarkFolder {
    required property name -> str;
    property icon -> str;
    required link user -> User;

    # Backlinks, meaning that the data is stored on the target, not here.
    multi link hasBookmarks := .<bookmarkFolder[is Bookmark];
  }
}
