CREATE TABLE "professor" (
  "email" varchar PRIMARY KEY NOT NULL,
  "name" varchar,
  "password" varchar,
  "date" date
);

CREATE TABLE "class" (
  "class_id" SERIAL PRIMARY KEY,
  "professor_email" varchar NOT NULL REFERENCES "professor" ("email") ON DELETE CASCADE,
  "name" varchar
);

CREATE TABLE "section" (
  "section_id" SERIAL PRIMARY KEY,
  "class_id" int NOT NULL REFERENCES "class" ("class_id") ON DELETE CASCADE
);

CREATE TABLE "student" (
  "email" varchar PRIMARY KEY NOT NULL,
  "name" varchar,
  "password" varchar,
  "date" date
);

CREATE TABLE "takes" (
  "student_id" varchar NOT NULL REFERENCES "student" ("email") ON DELETE CASCADE,
  "section_id" int NOT NULL REFERENCES "section" ("section_id") ON DELETE CASCADE
);

CREATE TABLE "rubric" (
  "rubric_id" SERIAL PRIMARY KEY,
  "assigned_date" timestamptz,
  "due_date" timestamptz,
  "final_due_date" timestamptz,
  "name" varchar
);

CREATE TABLE "section_rubric" (
  "section_id" int NOT NULL REFERENCES "section" ("section_id") ON DELETE CASCADE,
  "rubric_id" int NOT NULL REFERENCES "rubric" ("rubric_id") ON DELETE CASCADE
);

CREATE TABLE "prompt" (
	"prompt_id" SERIAL PRIMARY KEY,
	"rubric_id" int NOT NULL REFERENCES "rubric" ("rubric_id") ON DELETE CASCADE,
	"prompt_text" text
);

CREATE TABLE "question" (
  "question_id" SERIAL PRIMARY KEY,
  "prompt_id" int NOT NULL REFERENCES "prompt" ("prompt_id") ON DELETE CASCADE,
  "question_text" text,
  "min_char" int
);

CREATE TABLE "response" (
  "response_id" SERIAL PRIMARY KEY,
  "student_email" varchar NOT NULL REFERENCES "student" ("email") ON DELETE CASCADE,
  "response_value" text,
  "question_id" int NOT NULL REFERENCES "question" ("question_id") ON DELETE CASCADE
);

CREATE TABLE "prof_eval" (
  "eval_id" SERIAL PRIMARY KEY,
  "professor_email" varchar NOT NULL REFERENCES "professor" ("email") ON DELETE CASCADE,
  "response_id" int NOT NULL REFERENCES "response" ("response_id") ON DELETE CASCADE,
  "response_grade" real
);

CREATE TABLE "evaluation" (
  "eval_id" SERIAL PRIMARY KEY,
  "student_email" varchar NOT NULL REFERENCES "student" ("email") ON DELETE CASCADE,
  "response_id" int NOT NULL REFERENCES "response" ("response_id") ON DELETE CASCADE,
  "response_grade" real,
  "evaluation_grade" real
);
