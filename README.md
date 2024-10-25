<img src="https://avatars.githubusercontent.com/u/5495088?v=4" width="100" height="100" style="border-radius: 100%;">
<img src="https://cdn.icon-icons.com/icons2/3914/PNG/512/prisma_logo_icon_248778.png" width="100" height="100">

Hello, devs of Prisma 👋

I'm [Owen](https://owenrichards.dev/) and welcome to my take-home challenge for the Prisma Senior developer role.

For my implementation, I decided to build a class-based query engine, using Zod for validation and object-based arguments for querying data.

The commits should make it more manageable to review chunks of code at a time. I managed to complete this within the 5 hours allocated.

I look forward to talking through my implementation with you next week.

---

# Get Started

First, install packages with `yarn install`. Then:

- Run tests: `yarn test`
- Run server and output data: `yarn start`
- Lint: `yarn lint` or `yarn lint:fix`

# The Project

## Structure

The core of the project is in the [/src](/src) directory:

- [lib](/src/lib/): Classes with specific concerns: logging data to the console, the model query engine, and parsing CSV files
- [models](/src/models/): Where the individual models live that implement the classes in /lib

Each file has it's own documentation in the comments and are fairly self-explanatory. Each file also has a test with 100% code coverage.

Aside from this, there is an [/assets](/assets/) directory with sample CSV data to import.

## Packages used

I've tried to stay fairly lean without too many packages. The core pacakges (outside of TS/linting/Husky/etc) are:

1. [Zod](https://zod.dev): Data validation and type inferrence
1. [PapaParse](https://www.papaparse.com/): Converting CSV data to an array of objects

Generally, [Loadsh](https://lodash.com/) is my go-to for looping through data, but I decided not to for this to keep things TS-native.

I feel like every project these days needs a declaration of when and how AI was used. Here's mine:

_My only use of AI throughout this project was with Copilot for writing documentation comments in the classes and a little bit of auto-complete here and there. I don't use ChatGPT for writing code - it takes longer to get the AI to do it right than to do it yourself._

## Other considerations

**What were some of the tradeoffs you made when building this and why were these acceptable tradeoffs?**

> For the purpose of this project, I simply broke down the classes by input (Parse), processing (Model) and output (Logging). In reality, each of these would have more consideration on their own.

> The input and output classes are very simple by design (wrappers for `PapaParse` and the `console` API). I felt like the querying engine was the most appropriate place to focus my energy.

> I also initially considered on building a small Express server that ran, allowing the user to upload a CSV file and query that data via an extremely simple RESTful API, to demonstrate longer persisted in-memory storage. However, upon reflection I didn't feel like that was the best use of my time.

**Given more time, what improvements or optimizations would you want to add? When would you add them?**

> There are a few improvements I would make:

> - Handle errors closer to the source of the error. For example, Zod errors should be converted to catchable errors - I don't believe a 3rd party library should dictate a common error shape throughout the whole application. As soon as any of these classes are used elsewhere, (and don't go through the main `run()` method), those errors won't be correctly handled.
> - There are more perfomant ways to handle data looping - I would either look to implement the `Set` API, or something like lodash which is typically much more performant than native forEach and filter loops.

**What changes are needed to accommodate changes to support other data types, multiple filters, or ordering of results?**

> Extracting the findMany method to its own testable class for Model to implement would be my first step. The method is too large and will grow with more data types or operators available. As above, this would also need to be optimised.

> This system system doesn't account for any data types other than strings or numbers. Nested objects, dates, booleans, enums, and many other data types should be considered and implemented.

> I feel quite proud that it already supports multiple filters, combined with the other findMany arguments, and more models could be added fairly easily.

**What changes are needed to process extremely large datasets What do you still need to do to make this code production ready?**

> As above, optimising the filtering and projection would be an ideal first step. Furthermore, implementing a caching system to cache data for certain queries would be a smart step forward, as well as implementing an indexing system to retrieve records by ID.

> As the data is stored in-memory, the amount of data that the memory can store changes with each machine. We should add checks for memory usages throughout the app, perhaps using the `process.memoryUsage()` method.

---

I really enjoyed working on this challenge - I love getting my teeth into something specific and I enjoy seeing it all come together. Thank you for the opportunity.

I'd really love to get some feedback on this and what I could change or do better. Please feel free to reach out to hey@owenrichards.dev

✌️
