"use client";

import type { FighterCard, Countdown, Course } from "@/types";
import { MAX_DISTANCE_PER_FIGHTER, DAILY_SYNC_LIMIT } from "@/constants";
import { meditationCourses, yogaCourses } from "@/data";

type TrainingProgressSectionProps = {
  selectedMethod: "strava" | "meditation" | "yoga";
  selectionConfirmed: boolean;
  activeFighter: FighterCard;
  isShowingEmptyState: boolean;
  hasHellraiserNFTs: boolean;
  // Strava props
  countdown?: Countdown;
  currentDistance?: number;
  cycleTotalDistance?: number;
  syncsRemaining?: number;
  stravaConnected?: boolean;
  syncStatus?: "idle" | "syncing" | "done";
  selectionMessage?: string | null;
  onSync?: () => void;
  // Meditation/Yoga props
  selectedCourse?: number | null;
  videoTimer?: number | null;
  isVideoPaused?: boolean;
  isFullscreen?: boolean;
  onCourseSelect?: (courseId: number, timer: number) => void;
  onFullscreen?: (containerId: string) => void;
  onSyncTraining?: () => void;
};

export function TrainingProgressSection({
  selectedMethod,
  selectionConfirmed,
  activeFighter,
  isShowingEmptyState,
  hasHellraiserNFTs,
  countdown,
  currentDistance = 0,
  cycleTotalDistance = 0,
  syncsRemaining = 0,
  stravaConnected = false,
  syncStatus = "idle",
  selectionMessage,
  onSync,
  selectedCourse,
  videoTimer,
  isVideoPaused = false,
  isFullscreen = false,
  onCourseSelect,
  onFullscreen,
  onSyncTraining,
}: TrainingProgressSectionProps) {
  if (!activeFighter || isShowingEmptyState || !activeFighter.isOwned) {
    return (
      <section id="fourth-section" className="training-progress-section" style={{ margin: 0, padding: 0, marginTop: 0 }}>
        <div className="training-wrapper" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0, marginTop: 0 }}>
          <span className="training-error-text" style={{ color: "black" }}>
            Please set your {hasHellraiserNFTs ? "Hellraiser" : "fighter"} first
          </span>
        </div>
      </section>
    );
  }

  if (!selectionConfirmed) {
    return (
      <section id="fourth-section" className="training-progress-section" style={{ margin: 0, padding: 0, marginTop: 0 }}>
        <div className="training-wrapper" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0, marginTop: 0 }}>
          <span className="training-error-text" style={{ color: "black" }}>
            Please select a training method in Step 2
          </span>
        </div>
      </section>
    );
  }

  // Strava Training Section
  if (selectedMethod === "strava") {
    return (
      <section id="fourth-section" className="training-progress-section" style={{ margin: 0, padding: 0, marginTop: 0 }}>
        <div 
          className="training-wrapper" 
          style={{ 
            backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat", 
            width: "100%", 
            minHeight: "100vh" 
          }}
        >
          <div className="training-image-bar-left"></div>
          <div className="training-background">
            <div className="training-container">
              <div className="training-title">Training Progress</div>
              {countdown && (
                <div className="training-countdown">
                  Training Cycle #8 Ends In {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </div>
              )}
              
              {/* Progress Ring */}
              <div className="training-ring-outer">
                <svg className="training-ring-wrapper" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <circle 
                    className="training-background-circle" 
                    cx="100" 
                    cy="100" 
                    r="75" 
                    stroke="white" 
                    strokeWidth="20" 
                    strokeDasharray="471.23889803846896" 
                    strokeDashoffset={117.80972450961724 + (471.23889803846896 - 117.80972450961724) * Math.min(currentDistance / MAX_DISTANCE_PER_FIGHTER, 1)} 
                    fill="transparent" 
                    transform="rotate(136, 100 100)"
                  />
                  <circle 
                    className="training-additional-circle" 
                    cx="100" 
                    cy="100" 
                    r="75" 
                    stroke="rgb(153, 210, 154)" 
                    strokeWidth="20" 
                    strokeDasharray="471.23889803846896" 
                    strokeDashoffset="471.23889803846896" 
                    fill="transparent" 
                    transform="rotate(136 100 100)"
                  />
                  <circle 
                    className="training-filled-circle" 
                    cx="100" 
                    cy="100" 
                    r="75" 
                    stroke="rgb(211,72,55)" 
                    strokeWidth="20" 
                    strokeDasharray="471.23889803846896" 
                    strokeDashoffset={471.23889803846896 * (1 - Math.min(currentDistance / MAX_DISTANCE_PER_FIGHTER, 1))} 
                    fill="transparent" 
                    transform="rotate(136 100 100)"
                  />
                </svg>
                <div className="training-text-inside">
                  <div>{currentDistance === 0 ? "0 km" : `${currentDistance.toFixed(1)} km`}</div>
                </div>
                <div className="training-label">
                  <div>Current Fighter <br /> Progress</div>
                  <div className="training-additional-text">Max {MAX_DISTANCE_PER_FIGHTER} km / Fighter</div>
                </div>
              </div>

              {/* Stats Container */}
              <div className="training-stats-container">
                <div className="training-stats-item">
                  <div className="training-stats-label">Current Cycle Total Distance</div>
                  <div className="training-stats-value">
                    {cycleTotalDistance === 0 ? "0 km" : `${cycleTotalDistance.toFixed(1)} km`}
                  </div>
                </div>
              </div>

              <div className="training-text">
                Step 3. Sync your Strava Training Progress to train your fighter
              </div>
              
              {selectionMessage && (
                <div 
                  className={
                    selectionMessage.includes("error") || 
                    selectionMessage.includes("Please") || 
                    selectionMessage.includes("limit") 
                      ? "training-method-error-message" 
                      : "training-method-message"
                  } 
                  style={{ marginBottom: "15px", marginTop: "10px" }}
                >
                  {selectionMessage}
                </div>
              )}
              
              <button 
                type="button"
                className="training-submit-button" 
                disabled={syncStatus === "syncing"}
                onClick={onSync}
                style={{ 
                  cursor: syncStatus === "syncing" ? "not-allowed" : "pointer",
                  opacity: (!stravaConnected || syncStatus === "syncing" || syncsRemaining <= 0) ? 0.6 : 1
                }}
              >
                {syncStatus === "syncing" ? "Syncing..." : "Sync"}
              </button>
              <div className="training-text-secondary">
                You have [{syncsRemaining}/{DAILY_SYNC_LIMIT}] Syncs Left Today
              </div>
              
              <div className="training-button-container">
                <div className="training-mini-button">Training History</div>
                <div className="training-mini-button">
                  <a href="https://www.strava.com/dashboard" target="_blank" rel="noopener noreferrer">View In Strava</a>
                </div>
              </div>
              <div className="training-mini-button">
                <a href="https://squad.unbound.games/leaderboard" target="_blank" rel="noopener noreferrer">Leaderboard</a>
              </div>
              <div className="training-mini-text">
                Metadata will be updated at later stage of the cycle
              </div>
              <img 
                className="training-logo" 
                src="/assets/api_logo_pwrdBy_strava_horiz_white.png" 
                alt="Powered by Strava" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
              />
            </div>
          </div>
          <div className="training-image-bar-right"></div>
        </div>
      </section>
    );
  }

  // Meditation Training Section
  if (selectedMethod === "meditation") {
    return (
      <section id="fourth-section" className="training-progress-section" style={{ margin: 0, padding: 0, marginTop: 0 }}>
        <div 
          className="training-wrapper" 
          style={{ 
            backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat", 
            width: "100%", 
            minHeight: "100vh" 
          }}
        >
          <div className="training-image-bar-left"></div>
          <div className="training-background">
            <div className="training-container">
              <div className="training-title">🧘‍♂️ Meditation Training Progress</div>
              {countdown && (
                <div className="training-countdown">
                  Training Cycle #8 Ends In {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </div>
              )}
              <div className="training-section">
                <h3 className="training-section-title">📚 Select Your Meditation Course:</h3>
                <div className="training-course-grid">
                  {meditationCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`training-course-card ${selectedCourse === course.id ? "training-course-card--selected" : ""}`}
                      data-type="meditation"
                      onClick={() => onCourseSelect?.(course.id, course.timer)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="training-course-icon">
                        <img 
                          alt="Meditation" 
                          className="training-meditation-icon" 
                          src="/assets/meditation.png" 
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
                        />
                      </div>
                      <div className="training-course-title">{course.title}</div>
                      <div className="training-course-subtitle">{course.subtitle}</div>
                      <div className="training-course-logo">
                        <img alt="Fighters Unbound" className="training-fighters-logo" src="/assets/logo.png" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedCourse && (
                <div className="training-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 className="training-section-title" style={{ margin: 0 }}>Course Video</h3>
                    <button
                      type="button"
                      onClick={() => onFullscreen?.(`meditation-video-player-container-${selectedCourse}`)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#d34836",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                      {isFullscreen ? "⤓ Exit Fullscreen" : "⛶ Fullscreen"}
                    </button>
                  </div>
                  <div className="training-video-container">
                    <div 
                      id={`meditation-video-player-container-${selectedCourse}`} 
                      key={`meditation-container-${selectedCourse}`} 
                      style={{ 
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <iframe
                        key={`meditation-${selectedCourse}`}
                        id="meditation-video-player"
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title={`Meditation ${meditationCourses.find(c => c.id === selectedCourse)?.title}: ${meditationCourses.find(c => c.id === selectedCourse)?.subtitle}`}
                        style={{ width: "100%", height: isFullscreen ? "100vh" : "300px" }}
                        src={`https://www.youtube.com/embed/${meditationCourses.find(c => c.id === selectedCourse)?.videoId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&loop=0&fs=1&cc_load_policy=0&cc_lang_pref=en&hl=en&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}&widgetid=${(selectedCourse || 1) + 8}&forigin=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}&aoriginsup=1&vf=6`}
                      />
                      {videoTimer !== null && videoTimer !== undefined && (
                        <div className="training-video-timer">
                          <div className="training-timer-label">Questions in:</div>
                          <div className="training-timer-display">
                            {Math.floor(videoTimer / 60)}:{(videoTimer % 60).toString().padStart(2, "0")}
                            {isVideoPaused && <span className="training-timer-paused"> ⏸️ Paused</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {selectionMessage && (
                <div className="training-section">
                  <div className={syncStatus === "done" ? "training-success-message" : "training-error-message"} style={{ marginBottom: "20px" }}>
                    {selectionMessage}
                  </div>
                </div>
              )}
              <div className="training-section">
                <div className="training-text">
                  Step 3. Complete a meditation course and answer questions to train <b>all your fighters</b>
                </div>
                <button 
                  className="training-submit-button" 
                  disabled={!selectedCourse || (videoTimer !== null && videoTimer !== undefined && videoTimer > 0) || syncStatus === "syncing"}
                  onClick={onSyncTraining}
                  style={{ 
                    cursor: (!selectedCourse || (videoTimer !== null && videoTimer !== undefined && videoTimer > 0) || syncStatus === "syncing") ? "not-allowed" : "pointer",
                    opacity: (!selectedCourse || (videoTimer !== null && videoTimer !== undefined && videoTimer > 0) || syncStatus === "syncing") ? 0.6 : 1
                  }}
                >
                  {syncStatus === "syncing" ? "Syncing..." : "Sync For All Fighters"}
                </button>
              </div>
            </div>
          </div>
          <div className="training-image-bar-right"></div>
        </div>
      </section>
    );
  }

  // Yoga Training Section
  if (selectedMethod === "yoga") {
    return (
      <section id="fourth-section" className="training-progress-section" style={{ margin: 0, padding: 0, marginTop: 0 }}>
        <div 
          className="training-wrapper" 
          style={{ 
            backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat", 
            width: "100%", 
            minHeight: "100vh" 
          }}
        >
          <div className="training-image-bar-left"></div>
          <div className="training-background">
            <div className="training-container">
              <div className="training-title">🧘‍♀️ Yoga Training Progress</div>
              {countdown && (
                <div className="training-countdown">
                  Training Cycle #8 Ends In {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </div>
              )}
              <div className="training-section">
                <h3 className="training-section-title">📚 Select Your Yoga Course:</h3>
                <div className="training-course-grid">
                  {yogaCourses.map((course) => (
                    <div
                      key={course.id}
                      className={`training-course-card ${selectedCourse === course.id ? "training-course-card--selected" : ""}`}
                      data-type="yoga"
                      onClick={() => onCourseSelect?.(course.id, course.timer)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="training-course-icon">
                        <img 
                          alt="Yoga" 
                          className="training-yoga-icon" 
                          src="/assets/yoga.png" 
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
                        />
                      </div>
                      <div className="training-course-title">{course.title}</div>
                      <div className="training-course-subtitle">{course.subtitle}</div>
                      <div className="training-course-logo">
                        <img alt="Fighters Unbound" className="training-fighters-logo" src="/assets/logo.png" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedCourse && (
                <div className="training-section">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 className="training-section-title" style={{ margin: 0 }}>Course Video</h3>
                    <button
                      type="button"
                      onClick={() => onFullscreen?.(`yoga-video-player-container-${selectedCourse}`)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#d34836",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                      {isFullscreen ? "⤓ Exit Fullscreen" : "⛶ Fullscreen"}
                    </button>
                  </div>
                  <div className="training-video-container">
                    <div 
                      id={`yoga-video-player-container-${selectedCourse}`} 
                      key={`yoga-container-${selectedCourse}`} 
                      style={{ 
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <iframe
                        key={`yoga-${selectedCourse}`}
                        id="video-player"
                        frameBorder="0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title={`Yoga with Vlada: ${yogaCourses.find(c => c.id === selectedCourse)?.title} – ${yogaCourses.find(c => c.id === selectedCourse)?.subtitle}`}
                        style={{ width: "100%", height: isFullscreen ? "100vh" : "300px" }}
                        src={`https://www.youtube.com/embed/${yogaCourses.find(c => c.id === selectedCourse)?.videoId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&loop=0&fs=1&cc_load_policy=0&cc_lang_pref=en&hl=en&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}&widgetid=${(selectedCourse || 1) + 20}&forigin=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}&aoriginsup=1&vf=4`}
                      />
                      {videoTimer !== null && videoTimer !== undefined && (
                        <div className="training-video-timer">
                          <div className="training-timer-label">Questions in:</div>
                          <div className="training-timer-display">
                            {Math.floor(videoTimer / 60)}:{(videoTimer % 60).toString().padStart(2, "0")}
                            {isVideoPaused && <span className="training-timer-paused"> ⏸️ Paused</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {selectionMessage && (
                <div className="training-section">
                  <div className={syncStatus === "done" ? "training-success-message" : "training-error-message"} style={{ marginBottom: "20px" }}>
                    {selectionMessage}
                  </div>
                </div>
              )}
              <div className="training-section">
                <div className="training-text">
                  Step 3. Complete a yoga course and answer questions to train <b>all your fighters</b>
                </div>
                <button 
                  className="training-submit-button" 
                  disabled={!selectedCourse || (videoTimer !== null && videoTimer !== undefined && videoTimer > 0) || syncStatus === "syncing"}
                  onClick={onSyncTraining}
                  style={{ 
                    cursor: (!selectedCourse || (videoTimer !== null && videoTimer !== undefined && videoTimer > 0) || syncStatus === "syncing") ? "not-allowed" : "pointer",
                    opacity: (!selectedCourse || (videoTimer !== null && videoTimer !== undefined && videoTimer > 0) || syncStatus === "syncing") ? 0.6 : 1
                  }}
                >
                  {syncStatus === "syncing" ? "Syncing..." : "Sync For All Fighters"}
                </button>
              </div>
            </div>
          </div>
          <div className="training-image-bar-right"></div>
        </div>
      </section>
    );
  }

  return null;
}

