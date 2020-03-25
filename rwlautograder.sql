CREATE TABLE "section" (
  "section_id" varchar PRIMARY KEY,
  "class_id" varchar UNIQUE
);

CREATE TABLE "student" (
  "email" varchar PRIMARY KEY,
  "name" varchar,
  "password" varchar,
  "date" date
);

CREATE TABLE "professor" (
  "email" varchar PRIMARY KEY,
  "name" varchar,
  "password" varchar,
  "date" date
);

CREATE TABLE "prof_evals" (
  "eval_id" SERIAL PRIMARY KEY,
  "professor_email" varchar,
  "response_id" int UNIQUE,
  "response_grade" varchar
);

CREATE TABLE "takes" (
  "student_id" varchar,
  "section_id" varchar
);

CREATE TABLE "response" (
  "response_id" SERIAL PRIMARY KEY,
  "student_email" varchar,
  "response_value" varchar,
  "question_id" int
);

CREATE TABLE "question" (
  "question_id" int PRIMARY KEY,
  "rubric_id" int,
  "prompt" varchar,
  "question_value" varchar,
  "min_char" int
);

CREATE TABLE "rubric" (
  "rubric_id" SERIAL PRIMARY KEY,
  "assigned_date" date,
  "due_date" date,
  "final_due_date" date,
  "section_id" varchar
);

CREATE TABLE "class" (
  "class_id" varchar PRIMARY KEY,
  "professor_email" varchar,
  "name" varchar
);

CREATE TABLE "evaluation" (
  "eval_id" SERIAL PRIMARY KEY,
  "student_email" varchar,
  "response_id" int,
  "response_grade" varchar,
  "evaluation_grade" varchar
);

ALTER TABLE "class" ADD FOREIGN KEY ("class_id") REFERENCES "section" ("class_id");

ALTER TABLE "prof_evals" ADD FOREIGN KEY ("professor_email") REFERENCES "professor" ("email");

ALTER TABLE "response" ADD FOREIGN KEY ("response_id") REFERENCES "prof_evals" ("response_id");

ALTER TABLE "takes" ADD FOREIGN KEY ("student_id") REFERENCES "student" ("email");

ALTER TABLE "takes" ADD FOREIGN KEY ("section_id") REFERENCES "section" ("section_id");

ALTER TABLE "response" ADD FOREIGN KEY ("student_email") REFERENCES "student" ("email");

ALTER TABLE "response" ADD FOREIGN KEY ("question_id") REFERENCES "question" ("question_id");

ALTER TABLE "question" ADD FOREIGN KEY ("rubric_id") REFERENCES "rubric" ("rubric_id");

ALTER TABLE "rubric" ADD FOREIGN KEY ("section_id") REFERENCES "section" ("section_id");

ALTER TABLE "class" ADD FOREIGN KEY ("professor_email") REFERENCES "professor" ("email");

ALTER TABLE "evaluation" ADD FOREIGN KEY ("student_email") REFERENCES "student" ("email");

ALTER TABLE "evaluation" ADD FOREIGN KEY ("response_id") REFERENCES "response" ("response_id");
