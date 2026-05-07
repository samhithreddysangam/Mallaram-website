CREATE OR REPLACE VIEW "BookingView" AS
SELECT 
    b."id",
    u."name" as "farmerName",
    u."phone" as "farmerPhone",
    s."date" as "slotDate",
    s."startTime" as "startTime",
    s."endTime" as "endTime",
    s."location",
    b."status",
    b."createdAt"
FROM "Booking" b
JOIN "User" u ON b."userId" = u."id"
JOIN "Slot" s ON b."slotId" = s."id";
