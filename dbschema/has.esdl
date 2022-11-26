module has {
  abstract type CreatedAndUpdatedAt {
    property createdAt -> datetime {
      default := datetime_current();
      readonly := true;
    }
		property updatedAt -> datetime {
			default := datetime_current();
		}
  }

  abstract link createdAndUpdatedAt {
    property createdAt -> datetime {
      default := datetime_current();
      readonly := true;
    }
		property updatedAt -> datetime {
      default := datetime_current();
    }
  }
}