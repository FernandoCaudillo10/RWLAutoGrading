INSERT INTO professor (email,name,password,date) 
VALUES ('gbruns@csumb.edu','Glenn Bruns', 'password',current_timestamp);

INSERT INTO class (class_id,professor_email,name) 
VALUES (DEFAULT,'gbruns@csumb.edu','CST311');

INSERT INTO section (section_id,class_id) 
VALUES (DEFAULT,1), (DEFAULT,1);

INSERT INTO student (email,name,password,date) 
VALUES ('caldr@csumb.edu','Cesar Aldrete','qwerty',current_timestamp),('javi@csumb.edu','Fernando Caudillo','pass123',current_timestamp);

INSERT INTO takes (student_id, section_id) 
VALUES ('caldr@csumb.edu',1), ('javi@csumb.edu',2);

INSERT INTO rubric (rubric_id,assigned_date,due_date,final_due_date,section_id) 
VALUES (DEFAULT,current_timestamp+interval'5 days',current_timestamp+interval'12 days',current_timestamp+interval'15 days',1), (DEFAULT,current_timestamp+interval'5 days',current_timestamp+interval'12 days',current_timestamp+interval'15 days',2);

INSERT INTO prompt (prompt_id,rubric_id,prompt_text)
VALUES (DEFAULT,1,'Dont judge a book by the cover People take a look at the world and discover That beauty is the word that I think of when I see the different colors of skin And Ill rejoice and sing for them'), (DEFAULT,2,'Good vibes Were bringing only good vibes People walking around talking down on others You cant know yourself without knowing about the other');

INSERT INTO question (question_id,prompt_id,question_text,min_char)
VALUES (DEFAULT,1,'What is the one thing that all wise men, regardless of their religion or politics, agree is between heaven and earth?',150), (DEFAULT,1,'Think of words ending in -GRY. Angry and hungry are two of them. There are only three words in the English language. What is the third word?',150),(DEFAULT,2,'The day before yesterday, Chris was 7 years old. Next year, hell turn 10. Hows this possible?',150),(DEFAULT,2,'There is this one man who killed his mother. He was born before his father, and married over 100 women without divorcing any one. Yet, he was considered normal by all of his acquaintances. Why?',150);

INSERT INTO response (response_id,student_email,response_value,question_id)
VALUES (DEFAULT,'caldr@csumb.edu','The US Senate passed a massive, $2 trillion stimulus package late Wednesday night, with a vote of 96 to 0. The Senate’s approval of the largest economic relief package in American history came as the Labor Department reported that jobless claims for last week approached a record 3.3 million.',1),(DEFAULT,'caldr@csumb.edu','This is likely just the beginning as America faces an unprecedented challenge, with entire sectors of the economy practically shut down as people are ordered to remain in their homes.',2),(DEFAULT,'caldr@csumb.edu','Congress, though, has acted pretty rapidly to push through this $2 trillion stimulus relief package. The Senate passed the legislation that will include direct payments of $1,200 to most Americans making under $75,000, with more money for those who have children.',3), (DEFAULT,'caldr@csumb.edu','It also includes a $500 billion loan program for big businesses, more than $360 billion for small businesses, and billions for hospitals and state and local governments fighting the coronavirus. The House is expected to take it up Friday, after which it will head to Trump’s desk. The question now is whether it will be enough.',4),(DEFAULT,'javi@csumb.edu','Museums and cultural centers are shut down because of the coronavirus, including the National Cowboy & Western Heritage Museum in Oklahoma City, Oklahoma. And without any visitors, Tim, the head of security, got put in charge of the museum’s social media accounts.',1),(DEFAULT,'javi@csumb.edu','Chicago Mayor Lori Lightfoot is warning residents not to go on long runs or bike rides in the city’s latest effort to crack down over the spread of coronavirus, even cautioning that residents could be arrested should they break the rules.',2),(DEFAULT,'javi@csumb.edu','The statement also said Chicagoans are able, like in other states and localities, to "shop at the grocery stores that remain open, as long as you are not sick, and practice social distancing" and "continue visiting the restaurants that remain open for pick-up and delivery."',3),(DEFAULT,'javi@csumb.edu','In New York, the epicenter of the COVID-19 outbreak in the U.S., Gov. Andrew Cuomo made exceptions for media, health care providers and financial institutions, among others, were made as well, with workers falling into the category of "essential workers."',4);

INSERT INTO evaluation (eval_id,student_email,response_id,response_grade,evaluation_grade)
VALUES (DEFAULT,'javi@csumb.edu',1,85,75),(DEFAULT,'javi@csumb.edu',2,80,79),(DEFAULT,'caldr@csumb.edu',3,80,85),(DEFAULT,'javi@csumb.edu',4,82,90),(DEFAULT,'caldr@csumb.edu',5,75,45),(DEFAULT,'caldr@csumb.edu',6,98,54),(DEFAULT,'caldr@csumb.edu',7,65,90),(DEFAULT,'javi@csumb.edu',8,66,75);

INSERT INTO prof_evals (eval_id,professor_email,response_id,response_grade)
VALUES (DEFAULT,'gbruns@csumb.edu',1,98),(DEFAULT,'gbruns@csumb.edu',5,80),(DEFAULT,'gbruns@csumb.edu',8,55);

