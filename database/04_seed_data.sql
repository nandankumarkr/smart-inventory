-- ============================================================================
-- SMART INVENTORY MANAGEMENT SYSTEM (SIMS)
-- DBMS Experiential Learning - Level 3 Project
-- File: 04_seed_data.sql
-- Description: Realistic Baseline Demonstration Dataset
-- ============================================================================

-- 1. Users & Roles (Passwords are bcrypt hashed representation of 'Password@123')
INSERT INTO users (user_id, email, password_hash, full_name, role, department) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Dr. Rajesh Sharma', 'ADMIN', 'Executive Operations'),
('a0000000-0000-0000-0000-000000000002', 'manager@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Priya Venkatesh', 'MANAGER', 'Supply Chain & Procurement'),
('a0000000-0000-0000-0000-000000000003', 'staff@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Nandan Kumar', 'STAFF', 'Warehouse Logistics'),
('a0000000-0000-0000-0000-000000000004', 'auditor@smartinventory.io', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WvWp6m9Z2rGvG', 'Ananya Deshmukh', 'AUDITOR', 'Internal Quality Audit');

-- 2. Warehouses
INSERT INTO warehouses (warehouse_id, warehouse_code, name, address, city, capacity_sqft, manager_id) VALUES
('b0000000-0000-0000-0000-000000000001', 'WH-BLR-01', 'Bangalore Central Hub', 'Plot 45, Electronic City Phase 1', 'Bangalore', 50000.00, 'a0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000002', 'WH-BOM-02', 'Mumbai Port Fulfillment', 'Sector 18, JNPT Port Logistics Zone', 'Navi Mumbai', 75000.00, 'a0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000003', 'WH-DEL-03', 'Delhi NCR Cold Hub', 'Block D, Udyog Vihar Phase 5', 'Gurugram', 35000.00, 'a0000000-0000-0000-0000-000000000002');

-- 3. Product Categories
INSERT INTO product_categories (category_id, category_code, name, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'CAT-ELEC', 'Industrial Electronics', 'Microcontrollers, sensors, IoT gateways, and circuit boards'),
('c0000000-0000-0000-0000-000000000002', 'CAT-MED', 'Pharmaceutical & Vaccines', 'Temperature-controlled vaccines, antibiotics, and surgical supplies'),
('c0000000-0000-0000-0000-000000000003', 'CAT-MECH', 'Precision Hydraulic & Mechanical', 'Pumps, pneumatic valves, stainless steel fittings, and seals'),
('c0000000-0000-0000-0000-000000000004', 'CAT-CHEM', 'Specialty Industrial Chemicals', 'Corrosion inhibitors, food-grade lubricants, and cleaning reagents');

-- 4. Suppliers
INSERT INTO suppliers (supplier_id, supplier_code, company_name, contact_name, email, phone, address, rating, lead_time_days, is_preferred) VALUES
('d0000000-0000-0000-0000-000000000001', 'SUP-SEMICORP', 'SemiTech Micro Devices Ltd', 'Arjun Nair', 'arjun@semitech.co.in', '+91-9876543210', 'Peenya Industrial Estate, Bangalore', 4.85, 5, TRUE),
('d0000000-0000-0000-0000-000000000002', 'SUP-BIOLIFE', 'BioLife Pharma Solutions', 'Dr. Sunita Rao', 'procurement@biolifepharma.com', '+91-9812345678', 'Genome Valley, Hyderabad', 4.90, 3, TRUE),
('d0000000-0000-0000-0000-000000000003', 'SUP-HYDROFLOW', 'HydroFlow Engineering Valves', 'Vikram Patel', 'sales@hydroflowvalves.com', '+91-9823456789', 'GIDC Industrial Zone, Vadodara', 4.20, 12, FALSE),
('d0000000-0000-0000-0000-000000000004', 'SUP-CHEMPURE', 'ChemPure Reagents India', 'Kavita Menon', 'orders@chempureindia.com', '+91-9834567890', 'MIDC Tarapur, Maharashtra', 3.75, 15, FALSE);

-- 5. Products
INSERT INTO products (product_id, sku, name, description, category_id, unit_of_measure, cost_price, unit_price, reorder_level, target_stock_level, is_perishable, shelf_life_days) VALUES
('e0000000-0000-0000-0000-000000000001', 'SKU-STM32-01', 'STM32F4 Cortex-M4 Microcontroller', 'High-performance 32-bit RISC ARM MCU with 1MB Flash, DSP instructions and FPU', 'c0000000-0000-0000-0000-000000000001', 'pcs', 450.00, 680.00, 200, 1000, FALSE, NULL),
('e0000000-0000-0000-0000-000000000002', 'SKU-SENS-BMP280', 'BMP280 Digital Barometric Pressure Sensor', 'Ultra-compact digital sensor for barometric air pressure and ambient temperature measurement', 'c0000000-0000-0000-0000-000000000001', 'pcs', 120.00, 220.00, 150, 600, FALSE, NULL),
('e0000000-0000-0000-0000-000000000003', 'SKU-VAX-COV2', 'Cold-Chain mRNA Viral Vaccine Vial', 'Ultra-low temperature perishable vaccine vial, store strictly between -20C and -10C', 'c0000000-0000-0000-0000-000000000002', 'vials', 850.00, 1200.00, 100, 500, TRUE, 90),
('e0000000-0000-0000-0000-000000000004', 'SKU-INSULIN-100', 'Recombinant Human Insulin 100IU/ml', 'Biotherapeutic peptide hormone for blood glucose regulation, requires 2-8C refrigeration', 'c0000000-0000-0000-0000-000000000002', 'vials', 320.00, 550.00, 80, 400, TRUE, 180),
('e0000000-0000-0000-0000-000000000005', 'SKU-VALVE-HYD-50', 'High-Pressure Hydraulic Directional Valve', 'Heavy-duty solenoid directional control valve rated for 350 bar industrial systems', 'c0000000-0000-0000-0000-000000000003', 'units', 3400.00, 5200.00, 25, 100, FALSE, NULL),
('e0000000-0000-0000-0000-000000000006', 'SKU-PUMP-ROT-02', 'Rotary Gear Lubrication Pump', 'Self-priming positive displacement external gear pump for hydraulic oil circuits', 'c0000000-0000-0000-0000-000000000003', 'units', 4800.00, 7100.00, 15, 60, FALSE, NULL),
('e0000000-0000-0000-0000-000000000007', 'SKU-LUB-SYN-20', 'Synthetic Polyalphaolefin Gear Oil 20L', 'Extreme-pressure synthetic lubricant with high thermal stability and oxidation resistance', 'c0000000-0000-0000-0000-000000000004', 'canisters', 2200.00, 3150.00, 40, 150, TRUE, 730),
('e0000000-0000-0000-0000-000000000008', 'SKU-REAG-CLEAN-5', 'Bio-Degradable Ultrasonic Degreaser 5L', 'Aqueous neutral solvent formulated for precision ultrasonic ultrasonic parts cleaning', 'c0000000-0000-0000-0000-000000000004', 'bottles', 600.00, 950.00, 50, 200, FALSE, NULL);

-- 6. Product Vector Embeddings (Option 2: pgvector demo embeddings)
INSERT INTO product_embeddings (product_id, embedding_text, embedding, metadata) VALUES
('e0000000-0000-0000-0000-000000000001', 
 'STM32F4 Cortex-M4 Microcontroller 32-bit RISC ARM MCU 1MB Flash embedded systems', 
 array_fill(0.051::real, ARRAY[384])::vector,
 '{"brand": "STMicroelectronics", "voltage": "3.3V", "package": "LQFP100"}'::jsonb),

('e0000000-0000-0000-0000-000000000002', 
 'BMP280 Digital Barometric Pressure Sensor altitude temperature weather environmental IoT', 
 array_fill(0.048::real, ARRAY[384])::vector,
 '{"interface": "I2C/SPI", "accuracy": "±1 hPa"}'::jsonb),

('e0000000-0000-0000-0000-000000000003', 
 'Cold-Chain mRNA Viral Vaccine Vial ultra-low temperature perishable biologics healthcare', 
 array_fill(0.045::real, ARRAY[384])::vector,
 '{"storage_temp": "-20C", "dose_volume": "0.5ml"}'::jsonb),

('e0000000-0000-0000-0000-000000000004', 
 'Recombinant Human Insulin 100IU/ml pharmaceutical diabetes peptide cold chain 2-8C', 
 array_fill(0.046::real, ARRAY[384])::vector,
 '{"form": "Injectable Solution", "storage": "2-8C"}'::jsonb),

('e0000000-0000-0000-0000-000000000005', 
 'High-Pressure Hydraulic Directional Valve solenoid fluid power 350 bar industrial mechanical', 
 array_fill(0.053::real, ARRAY[384])::vector,
 '{"pressure_rating_bar": 350, "flow_rate_lpm": 80}'::jsonb),

('e0000000-0000-0000-0000-000000000006', 
 'Rotary Gear Lubrication Pump positive displacement fluid transmission machine tools', 
 array_fill(0.052::real, ARRAY[384])::vector,
 '{"displacement_cc": 16, "speed_rpm": 1450}'::jsonb),

('e0000000-0000-0000-0000-000000000007', 
 'Synthetic Polyalphaolefin Gear Oil 20L heavy duty lubrication high temperature resistant chemical', 
 array_fill(0.049::real, ARRAY[384])::vector,
 '{"viscosity_cst": 220, "iso_grade": "VG 220"}'::jsonb),

('e0000000-0000-0000-0000-000000000008', 
 'Bio-Degradable Ultrasonic Degreaser 5L aqueous cleaning industrial parts reagent', 
 array_fill(0.050::real, ARRAY[384])::vector,
 '{"ph_level": 7.4, "flash_point_c": 120}'::jsonb);

-- 7. Purchase Orders & Line Items
INSERT INTO purchase_orders (po_id, po_number, supplier_id, destination_warehouse_id, status, total_amount, created_by, order_date, expected_delivery_date, actual_delivery_date) VALUES
('f0000000-0000-0000-0000-000000000001', 'PO-2026-001', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'RECEIVED', 450000.00, 'a0000000-0000-0000-0000-000000000002', '2026-01-10', '2026-01-16', '2026-01-15'),
('f0000000-0000-0000-0000-000000000002', 'PO-2026-002', 'd0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'RECEIVED', 425000.00, 'a0000000-0000-0000-0000-000000000002', '2026-01-15', '2026-01-18', '2026-01-18'),
('f0000000-0000-0000-0000-000000000003', 'PO-2026-003', 'd0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'ISSUED', 170000.00, 'a0000000-0000-0000-0000-000000000002', '2026-02-01', '2026-02-14', NULL);

INSERT INTO purchase_order_items (po_item_id, po_id, product_id, ordered_quantity, received_quantity, unit_cost) VALUES
('fa000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1000, 1000, 450.00),
('fa000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000003', 500, 500, 850.00),
('fa000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000005', 50, 0, 3400.00);

-- 8. Inventory Batches
INSERT INTO inventory_batches (batch_id, batch_number, product_id, warehouse_id, po_item_id, initial_quantity, current_quantity, unit_cost, manufacturing_date, expiry_date) VALUES
('70000000-0000-0000-0000-000000000001', 'BATCH-2026-EL01', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'fa000000-0000-0000-0000-000000000001', 1000, 840, 450.00, '2025-12-01', NULL),
('70000000-0000-0000-0000-000000000002', 'BATCH-2026-SEN01', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', NULL, 600, 480, 120.00, '2025-11-15', NULL),
('70000000-0000-0000-0000-000000000003', 'BATCH-2026-VAX-A', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'fa000000-0000-0000-0000-000000000002', 250, 45, 850.00, '2026-01-01', CURRENT_DATE + INTERVAL '12 days'),
('70000000-0000-0000-0000-000000000004', 'BATCH-2026-VAX-B', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'fa000000-0000-0000-0000-000000000002', 250, 220, 850.00, '2026-01-10', CURRENT_DATE + INTERVAL '78 days'),
('70000000-0000-0000-0000-000000000005', 'BATCH-2026-INS-01', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', NULL, 350, 190, 320.00, '2025-12-10', CURRENT_DATE + INTERVAL '140 days'),
('70000000-0000-0000-0000-000000000006', 'BATCH-2026-VLV-01', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', NULL, 40, 18, 3400.00, '2025-10-01', NULL),
('70000000-0000-0000-0000-000000000007', 'BATCH-2026-PMP-01', 'e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000002', NULL, 20, 8, 4800.00, '2025-09-15', NULL),
('70000000-0000-0000-0000-000000000008', 'BATCH-2026-OIL-01', 'e0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', NULL, 80, 22, 2200.00, '2025-08-01', CURRENT_DATE + INTERVAL '520 days');

-- 9. Double-Entry Stock Ledger Transactions
INSERT INTO inventory_transactions (transaction_ref, transaction_type, product_id, warehouse_id, batch_id, quantity_change, balance_after, performed_by, notes) VALUES
('TX-INIT-001', 'PO_RECEIPT', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 1000, 1000, 'a0000000-0000-0000-0000-000000000003', 'Initial PO-2026-001 fulfillment'),
('TX-ORD-901', 'SALE_FULFILLMENT', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', -160, 840, 'a0000000-0000-0000-0000-000000000003', 'Client dispatch order SO-8842');

-- 10. Inter-Warehouse Transfers
INSERT INTO stock_transfers (transfer_id, transfer_number, source_warehouse_id, target_warehouse_id, status, requested_by, approved_by, tracking_reference) VALUES
('80000000-0000-0000-0000-000000000001', 'TRF-2026-001', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'PENDING', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'BLR-EXP-7721');

INSERT INTO stock_transfer_items (transfer_id, product_id, source_batch_id, quantity) VALUES
('80000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 50);

-- 11. Semi-Structured NoSQL Telemetry (IoT Cold Chain & Facility Sensors)
INSERT INTO warehouse_telemetry (warehouse_id, zone_code, sensor_payload, device_id) VALUES
('b0000000-0000-0000-0000-000000000003', 'ZONE-COLD-A', '{"temp_c": -18.4, "humidity_pct": 42.1, "compressor_load_pct": 78, "door_opened_count": 4, "alerts": []}'::jsonb, 'IOT-SENS-DEL-01'),
('b0000000-0000-0000-0000-000000000003', 'ZONE-COLD-B', '{"temp_c": 3.8, "humidity_pct": 58.2, "compressor_load_pct": 62, "door_opened_count": 12, "alerts": []}'::jsonb, 'IOT-SENS-DEL-02'),
('b0000000-0000-0000-0000-000000000001', 'ZONE-DRY-MAIN', '{"temp_c": 24.5, "humidity_pct": 48.0, "ambient_lux": 350, "air_quality_index": 45}'::jsonb, 'IOT-SENS-BLR-01'),
('b0000000-0000-0000-0000-000000000002', 'ZONE-HEAVY-RACK', '{"temp_c": 28.2, "humidity_pct": 68.5, "floor_vibration_g": 0.04, "alerts": ["high_humidity"]}'::jsonb, 'IOT-SENS-BOM-01');

-- 12. Outbound Sales Orders (For Daily Revenue Summaries View)
INSERT INTO sales_orders (order_id, order_number, customer_name, order_date, total_amount, total_cost_basis, status) VALUES
('90000000-0000-0000-0000-000000000001', 'SO-2026-081', 'Apollo Multi-Specialty Hospital', CURRENT_DATE - INTERVAL '1 day', 108800.00, 72000.00, 'COMPLETED'),
('90000000-0000-0000-0000-000000000002', 'SO-2026-082', 'Bosch Automotive India', CURRENT_DATE, 156000.00, 102000.00, 'COMPLETED'),
('90000000-0000-0000-0000-000000000003', 'SO-2026-083', 'Manipal Health Enterprises', CURRENT_DATE, 93500.00, 54400.00, 'COMPLETED');

INSERT INTO sales_order_items (order_id, product_id, quantity, unit_price, unit_cost) VALUES
('90000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 160, 680.00, 450.00),
('90000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000005', 30, 5200.00, 3400.00),
('90000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000004', 170, 550.00, 320.00);

-- 13. Customer Reviews with Sentiment Analysis & Feedback Embeddings
-- (Proposal Requirement: "product reviews and unstructured feedback embeddings")
INSERT INTO product_reviews (product_id, customer_name, rating, review_text, sentiment_score, sentiment_label, review_embedding) VALUES
('e0000000-0000-0000-0000-000000000003', 'Dr. Alok Verma', 5, 'Exceptional cold chain integrity. Temperature vials remained strictly below -15C throughout delivery.', 0.94, 'POSITIVE', array_fill(0.045::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000003', 'Karan Mehta (Lab Logistics)', 4, 'Packaging was robust and FIFO batch expiry verification was effortless on arrival.', 0.78, 'POSITIVE', array_fill(0.046::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000004', 'Nurse Sneha Pillai', 5, 'Highly stable insulin formulation. Rapid delivery from Delhi hub avoided any degradation.', 0.89, 'POSITIVE', array_fill(0.045::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000005', 'Rohan Sengupta (Industrial Eng)', 4, 'Directional valve held up to 340 bar continuous duty without hydraulic leakages.', 0.72, 'POSITIVE', array_fill(0.052::real, ARRAY[384])::vector),
('e0000000-0000-0000-0000-000000000008', 'Suresh Kumar (Maintenance)', 2, 'Solvent is effective but smell is pungent and container lid had minor leakage during transit.', -0.45, 'NEGATIVE', array_fill(0.041::real, ARRAY[384])::vector);

