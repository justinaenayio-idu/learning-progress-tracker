import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router";

function Header() {
  return (
    <header>
      <h1>Learning Progress Tracker</h1>
      <p>Track what you are learning and monitor your progress.</p>
    </header>
  );
}

function TopicCard({ topic, onToggleComplete, onDelete }) {
  return (
    <article>
      <h2>{topic.title}</h2>
      <p>Category: {topic.category}</p>
      <p>Status: {topic.status}</p>

      <button
        type="button"
        onClick={() => onToggleComplete(topic.id)}
      >
        {topic.status === "Completed"
          ? "Mark as In Progress"
          : "Mark as Completed"}
      </button>

      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(topic.id)}
      >
        Delete
      </button>
    </article>
  );
}

function ProgressSummary({ total, completed }) {
  return (
    <p>
      {completed} of {total} topics completed.
    </p>
  );
}

function TopicForm({ onAddTopic }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("React");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle === "") {
      setError("Please enter a topic title.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await onAddTopic({
        title: trimmedTitle,
        category,
      });

      setTitle("");
      setCategory("React");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a learning topic</h2>

      <div>
        <label htmlFor="topic-title">Topic title</label>
        <input
          id="topic-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="topic-category">Category</label>
        <select
          id="topic-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="React">React</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Node.js">Node.js</option>
        </select>
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Topic"}
      </button>
    </form>
  );
}

function TopicFilter({ value, onFilterChange }) {
  return (
    <div>
      <label htmlFor="status-filter">Filter by status</label>

      <select
        id="status-filter"
        value={value}
        onChange={(event) => onFilterChange(event.target.value)}
      >
        <option value="All">All</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
}

function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <Link to="/">Dashboard</Link>
      {" | "}
      <Link to="/topics">Topics</Link>
    </nav>
  );
}

function TopicDetails({ topics }) {
  const { topicId } = useParams();

  const topic = topics.find(
    (item) => String(item.id) === topicId
  );

  if (!topic) {
    return (
      <section>
        <h2>Topic not found</h2>
        <Link to="/topics">Back to topics</Link>
      </section>
    );
  }

  return (
    <section>
      <h2>{topic.title}</h2>
      <p>Category: {topic.category}</p>
      <p>Status: {topic.status}</p>
      <Link to="/topics">Back to topics</Link>
    </section>
  );
}

export default function App() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTopics() {
      try {
        setIsLoading(true);
        setFetchError("");

        const response = await fetch(
          "http://localhost:3001/api/topics",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Could not load topics. HTTP status: ${response.status}`
          );
        }

        const data = await response.json();
        setTopics(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setFetchError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchTopics();

    return () => {
      controller.abort();
    };
  }, []);

  function handleToggleComplete(topicId) {
    setTopics((previousTopics) =>
      previousTopics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              status:
                topic.status === "Completed"
                  ? "In Progress"
                  : "Completed",
            }
          : topic
      )
    );
  }

  async function handleAddTopic(topicInput) {
    const response = await fetch(
      "http://localhost:3001/api/topics",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicInput),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not add the topic.");
    }

    setTopics((previousTopics) => [
      ...previousTopics,
      data,
    ]);
  }

  function handleDeleteTopic(topicId) {
    setTopics((previousTopics) =>
      previousTopics.filter((topic) => topic.id !== topicId)
    );
  }

  const completedCount = topics.filter(
    (topic) => topic.status === "Completed"
  ).length;

  const visibleTopics = topics.filter((topic) => {
    if (statusFilter === "All") {
      return true;
    }

    return topic.status === statusFilter;
  });

  if (isLoading) {
    return <p role="status">Loading topics...</p>;
  }

  if (fetchError) {
    return (
      <section>
        <h1>Unable to load topics</h1>
        <p role="alert">{fetchError}</p>
        <p>
          Check that the backend is running, then refresh this page.
        </p>
      </section>
    );
  }

  return (
    <BrowserRouter>
      <main>
        <Header />
        <Navigation />

        <Routes>
          <Route
            path="/"
            element={
              <section>
                <h2>Dashboard</h2>

                <ProgressSummary
                  total={topics.length}
                  completed={completedCount}
                />
              </section>
            }
          />

          <Route
            path="/topics"
            element={
              <section>
                <h2>Learning topics</h2>

                <TopicForm onAddTopic={handleAddTopic} />

                <TopicFilter
                  value={statusFilter}
                  onFilterChange={setStatusFilter}
                />

                {topics.length === 0 ? (
                  <p>
                    No topics yet. Add a topic using the form above.
                  </p>
                ) : visibleTopics.length === 0 ? (
                  <p>No topics match the selected status.</p>
                ) : (
                  visibleTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTopic}
                    />
                  ))
                )}
              </section>
            }
          />

          <Route
            path="/topics/:topicId"
            element={<TopicDetails topics={topics} />}
          />

          <Route
            path="*"
            element={
              <section>
                <h2>Page not found</h2>
                <Link to="/">Go to Dashboard</Link>
              </section>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
