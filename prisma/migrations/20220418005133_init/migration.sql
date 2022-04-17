-- CreateTable
CREATE TABLE "Customer" (
    "Id" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "SerialCode" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Installation" (
    "Id" TEXT NOT NULL,
    "CustomerId" TEXT NOT NULL,
    "SensorId" TEXT NOT NULL,
    "LocalType" TEXT NOT NULL,
    "Remarks" TEXT DEFAULT E'',
    "Date" TIMESTAMP(3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Installation_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "InstallationMonitoringData" (
    "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "InstallationId" TEXT NOT NULL,
    "MeasurementValue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "InstallationMonitoringData_pkey" PRIMARY KEY ("Timestamp")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_Email_key" ON "Customer"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_SerialCode_key" ON "Sensor"("SerialCode");

-- AddForeignKey
ALTER TABLE "Installation" ADD CONSTRAINT "Installation_CustomerId_fkey" FOREIGN KEY ("CustomerId") REFERENCES "Customer"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installation" ADD CONSTRAINT "Installation_SensorId_fkey" FOREIGN KEY ("SensorId") REFERENCES "Sensor"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationMonitoringData" ADD CONSTRAINT "InstallationMonitoringData_InstallationId_fkey" FOREIGN KEY ("InstallationId") REFERENCES "Installation"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
