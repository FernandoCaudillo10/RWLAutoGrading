CREATE TABLE "professor" (
  "email" varchar PRIMARY KEY NOT NULL,
  "name" varchar,
  "password" varchar,
  "date" date
);

CREATE TABLE "class" (
  "class_id" SERIAL PRIMARY KEY,
  "professor_email" varchar NOT NULL REFERENCES "professor" ("email"),
  "name" varchar
);

CREATE TABLE "section" (
  "section_id" SERIAL PRIMARY KEY,
  "class_id" int NOT NULL REFERENCES "class" ("class_id")
);

CREATE TABLE "student" (
  "email" varchar PRIMARY KEY NOT NULL,
  "name" varchar,
  "password" varchar,
  "date" date
);

CREATE TABLE "takes" (
  "student_id" varchar NOT NULL REFERENCES "student" ("email"),
  "section_id" int NOT NULL REFERENCES "section" ("section_id")
);

CREATE TABLE "rubric" (
  "rubric_id" SERIAL PRIMARY KEY,
  "assigned_date" timestamptz,
  "due_date" timestamptz,
  "final_due_date" timestamptz
);

CREATE TABLE "section_rubric" (
  "section_id" int NOT NULL REFERENCES "section" ("section_id"),
  "rubric_id" int NOT NULL REFERENCES "rubric" ("rubric_id")
);

CREATE TABLE "prompt" (
	"prompt_id" SERIAL PRIMARY KEY,
	"rubric_id" int NOT NULL REFERENCES "rubric" ("rubric_id"),
	"prompt_text" text
);

CREATE TABLE "question" (
  "question_id" SERIAL PRIMARY KEY,
  "prompt_id" int NOT NULL REFERENCES "prompt" ("prompt_id"),
  "question_text" text,
  "min_char" int
);

CREATE TABLE "response" (
  "response_id" SERIAL PRIMARY KEY,
  "student_email" varchar NOT NULL REFERENCES "student" ("email"),
  "response_value" text,
  "question_id" int NOT NULL REFERENCES "question" ("question_id")
);

CREATE TABLE "prof_evals" (
  "eval_id" SERIAL PRIMARY KEY,
  "professor_email" varchar NOT NULL REFERENCES "professor" ("email"),
  "response_id" int NOT NULL REFERENCES "response" ("response_id"),
  "response_grade" varchar
);

CREATE TABLE "evaluation" (
  "eval_id" SERIAL PRIMARY KEY,
  "student_email" varchar NOT NULL REFERENCES "student" ("email"),
  "response_id" int NOT NULL REFERENCES "response" ("response_id"),
  "response_grade" int,
  "evaluation_grade" int
);
