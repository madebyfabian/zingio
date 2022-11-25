module default {
  type User {
    required property handle -> str {
      constraint exclusive;
    };
    property name -> str;
    property authId -> str {
      constraint exclusive;
    }
    property description -> str;
    required property createdAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required property updatedAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    multi link followingUsers -> User {
      property followingSince -> cal::local_datetime {
        default := cal::to_local_datetime(datetime_current(), 'UTC');
      }
    };

    # Backlinks, meaning that the data is stored on the target, not here.
    multi link posts := .<authorUser[is Post];
    multi link isFollowedByUsers := .<followingUsers[is User];

    # Indexes
    index on (.handle);
    index on (.authId);
  }

  type Post {
    required property content -> str;
    required property createdAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required property updatedAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required property isDeleted -> bool {
      default := false;
    }
    link replyToPost -> Post;
    required link authorUser -> User;
    multi link postReactions -> PostReaction {
      on source delete delete target;
      constraint exclusive;
    };
  }

  type PostReaction {
    required property createdAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required property updatedAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required link user -> User;
  }

  type Bookmark {
    required property createdAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required property updatedAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required link user -> User;
    required link post -> Post;
    link bookmarkFolder -> BookmarkFolder;
  }

  type BookmarkFolder {
    required property name -> str;
    property icon -> str;
    required property createdAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required property updatedAt -> cal::local_datetime {
      default := cal::to_local_datetime(datetime_current(), 'UTC');
    }
    required link user -> User;

    # Backlinks, meaning that the data is stored on the target, not here.
    multi link hasBookmarks := .<bookmarkFolder[is Bookmark];
  }
}
