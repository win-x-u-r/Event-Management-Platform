CREATE TABLE IF NOT EXISTS EVENT_TABLE (
    Event_ID INTEGER PRIMARY KEY,
    Event_Name VARCHAR(100),
    Venue VARCHAR(100),
    Event_Start_Time TIME,
    Event_End_Time TIME,
    Event_Start_Date DATE,
    Event_End_Date DATE,
    Event_Location VARCHAR(100),
    Available_Seats INTEGER,
    Event_Status VARCHAR(50),
    Event_Description TEXT,
    Event_Host VARCHAR(100)
    -- Budget_ID INTEGER FOREIGN KEY REFERENCES BUDGET_TABLE(Budget_ID),
);

CREATE TABLE IF NOT EXISTS USER_TABLE (
    User_ID INTEGER PRIMARY KEY,
    User_First_Name VARCHAR(50),
    User_Last_Name VARCHAR(50),
    User_Department VARCHAR(100),
    User_Role VARCHAR(20),
);

CREATE TABLE IF NOT EXISTS MEDIA_TABLE (
    Media_ID INTEGER PRIMARY KEY,
    Media_URL TEXT,
    MEDIA_TYPE VARCHAR(50),
    Media_Name VARCHAR(100),
    User_ID INTEGER FOREIGN KEY REFERENCES USER_TABLE(User_ID),
    Media_Size INTEGER
);

CREATE TABLE IF NOT EXISTS BUDGET_TABLE (
    Budget_ID INTEGER PRIMARY KEY,
    Item_Name VARCHAR(100),
    Item_Quantity INTEGER,
    Item_Cost DECIMAL(10, 2),
    Total_Cost DECIMAL(10, 2),
    Budget_Status VARCHAR(50),
);
