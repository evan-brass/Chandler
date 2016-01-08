# Chandler
My attempt at recreating the Chandler PIM using lots and lots of the Javascript.

## Parts
There are a couple of different parts in here: the Repository and the RepositoryItem,
the Collection (this is how you get any object or group of objects from the Repository), and then everything else.

### Repository
The repository uses local storage and JSON.stringify to put the code objects into the repository.  
This means that you can store anything you want in it.  I intend to implement a calendar, note/task system, contacts and
some sort of sharing system.  That said, the code should be able to accomidate any kind of Personal information imaginable.

### Collection
The collection is an item that can be stored in the repository (a task list, an email list, etc.) but it is also how you get any
thing from the repository.  This is because the Collection doesn't hold the items themselves but is rather a way to find the items.
It has a filter function that is checked against every item in the repository to see if it is in the collection.
I understand that there are security risks to this but this is just a test.
