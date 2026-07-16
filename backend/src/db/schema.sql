-- AI Code Review Assistant - schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    mobile_number   VARCHAR(20),
    avatar_url      TEXT,
    reset_token     VARCHAR(255),
    reset_token_expires TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    language            VARCHAR(40) NOT NULL,
    source_type         VARCHAR(20) NOT NULL DEFAULT 'paste', -- 'paste' | 'upload' | 'github'
    original_filename   VARCHAR(255),
    code                TEXT NOT NULL,

    -- Complexity metrics
    lines_of_code       INTEGER DEFAULT 0,
    function_count      INTEGER DEFAULT 0,
    class_count         INTEGER DEFAULT 0,
    cyclomatic_complexity INTEGER DEFAULT 0,

    -- Aggregate severity summary, e.g. {"critical":1,"warning":3,"info":2}
    severity_summary    JSONB DEFAULT '{}'::jsonb,

    -- Free-form AI summary text
    ai_summary          TEXT,

    status              VARCHAR(20) NOT NULL DEFAULT 'completed', -- 'processing'|'completed'|'failed'
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS review_issues (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id       UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    source          VARCHAR(20) NOT NULL, -- 'static' | 'ai'
    category        VARCHAR(60) NOT NULL, -- e.g. 'bug', 'security', 'style', 'naming'
    severity        VARCHAR(20) NOT NULL, -- 'critical' | 'warning' | 'info'
    line_number     INTEGER,
    message         TEXT NOT NULL,
    suggestion      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_issues_review_id ON review_issues(review_id);
