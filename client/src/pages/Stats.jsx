import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const XP_PER_LEVEL = 100;

export default function Stats() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    xp: 0,
    challengesCompleted: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (!user?.sub) return;

    const controller = new AbortController();

    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${apiBaseUrl}/api/users/preferences?auth0Id=${encodeURIComponent(
            user.sub,
          )}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Unable to load your stats.");
        }

        const data = await response.json();

        setStats({
          xp: Number(data.user?.xp) || 0,
          challengesCompleted:
            Number(data.user?.challenges_completed) || 0,
        });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load your stats.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => controller.abort();
  }, [apiBaseUrl, user?.sub]);

  const levelStats = useMemo(() => {
    const level = Math.floor(stats.xp / XP_PER_LEVEL) + 1;
    const xpIntoLevel = stats.xp % XP_PER_LEVEL;
    const xpRemaining = XP_PER_LEVEL - xpIntoLevel;
    const progress = (xpIntoLevel / XP_PER_LEVEL) * 100;

    return {
      level,
      xpIntoLevel,
      xpRemaining,
      progress,
    };
  }, [stats.xp]);

  return (
    <main className="container stats-page">
      <section className="stats-card" aria-labelledby="stats-title">
        <div className="stats-heading">
          <div>
            <p className="stats-kicker">Player Progress</p>
            <h2 id="stats-title">Your Stats</h2>
          </div>

          <div
            className="level-badge"
            aria-label={`Level ${levelStats.level}`}
          >
            <span>LVL</span>
            <strong>{levelStats.level}</strong>
          </div>
        </div>

        {isLoading ? (
          <p className="stats-message">Loading player data...</p>
        ) : error ? (
          <p className="stats-message stats-error">{error}</p>
        ) : (
          <>
            <div className="xp-total">
              <span>Total XP</span>
              <strong>{stats.xp.toLocaleString()}</strong>
            </div>

            <div className="level-progress-section">
              <div className="progress-labels">
                <span>Level {levelStats.level}</span>
                <span>Level {levelStats.level + 1}</span>
              </div>

              <div
                className="xp-progress-track"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax={XP_PER_LEVEL}
                aria-valuenow={levelStats.xpIntoLevel}
                aria-label="XP progress toward next level"
              >
                <div
                  className="xp-progress-fill"
                  style={{
                    width: `${levelStats.progress}%`,
                  }}
                />
              </div>

              <div className="progress-details">
                <strong>
                  {levelStats.xpIntoLevel} / {XP_PER_LEVEL} XP
                </strong>

                <span>
                  {levelStats.xpRemaining} XP until next level
                </span>
              </div>
            </div>

            <div className="stats-grid">
              <article className="stat-tile">
                <span>Current Level</span>
                <strong>{levelStats.level}</strong>
              </article>

              <article className="stat-tile">
                <span>Challenges Done</span>
                <strong>{stats.challengesCompleted}</strong>
              </article>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </section>
    </main>
  );
}