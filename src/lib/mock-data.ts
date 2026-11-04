import { 
  User, Warehouse, ProductCategory, Product, InventoryBatch, 
  InventoryTransaction, Supplier, PurchaseOrder, StockTransfer,
  LowStockAlert, InventoryValuation, SupplierScorecard
} from './types';

export const MOCK_USERS: User[] = [
  {
    user_id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@smartinventory.io',
    full_name: 'Dr. Rajesh Sharma',
    role: 'ADMIN',
    department: 'Executive Operations',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    user_id: 'a0000000-0000-0000-0000-000000000002',
    email: 'manager@smartinventory.io',
    full_name: 'Priya Venkatesh',
    role: 'MANAGER',
    department: 'Supply Chain & Procurement',
    is_active: true,
    created_at: '2026-01-02T00:00:00Z'
  },
  {
    user_id: 'a0000000-0000-0000-0000-000000000003',
    email: 'staff@smartinventory.io',
    full_name: 'Nandan Kumar',
    role: 'STAFF',
    department: 'Warehouse Logistics',
    is_active: true,
    created_at: '2026-01-03T00:00:00Z'
  },
  {
    user_id: 'a0000000-0000-0000-0000-000000000004',
    email: 'auditor@smartinventory.io',
    full_name: 'Ananya Deshmukh',
    role: 'AUDITOR',
    department: 'Internal Quality Audit',
    is_active: true,
    created_at: '2026-01-04T00:00:00Z'
  }
];

export const MOCK_WAREHOUSES: Warehouse[] = [
  {
    warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_code: 'WH-BLR-01',
    name: 'Bangalore Central Hub',
    address: 'Plot 45, Electronic City Phase 1',
    city: 'Bangalore',
    country: 'India',
    capacity_sqft: 50000,
    current_occupancy_pct: 68.4,
    manager_name: 'Priya Venkatesh',
    is_active: true
  },
  {
    warehouse_id: 'b0000000-0000-0000-0000-000000000002',
    warehouse_code: 'WH-BOM-02',
    name: 'Mumbai Port Fulfillment',
    address: 'Sector 18, JNPT Port Logistics Zone',
    city: 'Navi Mumbai',
    country: 'India',
    capacity_sqft: 75000,
    current_occupancy_pct: 42.1,
    manager_name: 'Priya Venkatesh',
    is_active: true
  },
  {
    warehouse_id: 'b0000000-0000-0000-0000-000000000003',
    warehouse_code: 'WH-DEL-03',
    name: 'Delhi NCR Cold Hub',
    address: 'Block D, Udyog Vihar Phase 5',
    city: 'Gurugram',
    country: 'India',
    capacity_sqft: 35000,
    current_occupancy_pct: 82.5,
    manager_name: 'Priya Venkatesh',
    is_active: true
  }
];

export const MOCK_CATEGORIES: ProductCategory[] = [
  { category_id: 'c0000000-0000-0000-0000-000000000001', category_code: 'CAT-ELEC', name: 'Industrial Electronics' },
  { category_id: 'c0000000-0000-0000-0000-000000000002', category_code: 'CAT-MED', name: 'Pharmaceutical & Vaccines' },
  { category_id: 'c0000000-0000-0000-0000-000000000003', category_code: 'CAT-MECH', name: 'Precision Hydraulic & Mechanical' },
  { category_id: 'c0000000-0000-0000-0000-000000000004', category_code: 'CAT-CHEM', name: 'Specialty Industrial Chemicals' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    product_id: 'e0000000-0000-0000-0000-000000000001',
    sku: 'SKU-STM32-01',
    name: 'STM32F4 Cortex-M4 Microcontroller',
    description: 'High-performance 32-bit RISC ARM MCU with 1MB Flash, DSP instructions and FPU',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Industrial Electronics',
    unit_of_measure: 'pcs',
    cost_price: 450.00,
    unit_price: 680.00,
    reorder_level: 200,
    target_stock_level: 1000,
    is_perishable: false,
    total_on_hand: 840,
    stock_status: 'OPTIMAL'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000002',
    sku: 'SKU-SENS-BMP280',
    name: 'BMP280 Digital Barometric Pressure Sensor',
    description: 'Ultra-compact digital sensor for barometric air pressure and ambient temperature measurement',
    category_id: 'c0000000-0000-0000-0000-000000000001',
    category_name: 'Industrial Electronics',
    unit_of_measure: 'pcs',
    cost_price: 120.00,
    unit_price: 220.00,
    reorder_level: 150,
    target_stock_level: 600,
    is_perishable: false,
    total_on_hand: 480,
    stock_status: 'OPTIMAL'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000003',
    sku: 'SKU-VAX-COV2',
    name: 'Cold-Chain mRNA Viral Vaccine Vial',
    description: 'Ultra-low temperature perishable vaccine vial, store strictly between -20C and -10C',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    category_name: 'Pharmaceutical & Vaccines',
    unit_of_measure: 'vials',
    cost_price: 850.00,
    unit_price: 1200.00,
    reorder_level: 100,
    target_stock_level: 500,
    is_perishable: true,
    shelf_life_days: 90,
    total_on_hand: 265,
    stock_status: 'OPTIMAL'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000004',
    sku: 'SKU-INSULIN-100',
    name: 'Recombinant Human Insulin 100IU/ml',
    description: 'Biotherapeutic peptide hormone for blood glucose regulation, requires 2-8C refrigeration',
    category_id: 'c0000000-0000-0000-0000-000000000002',
    category_name: 'Pharmaceutical & Vaccines',
    unit_of_measure: 'vials',
    cost_price: 320.00,
    unit_price: 550.00,
    reorder_level: 80,
    target_stock_level: 400,
    is_perishable: true,
    shelf_life_days: 180,
    total_on_hand: 190,
    stock_status: 'OPTIMAL'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000005',
    sku: 'SKU-VALVE-HYD-50',
    name: 'High-Pressure Hydraulic Directional Valve',
    description: 'Heavy-duty solenoid directional control valve rated for 350 bar industrial systems',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    category_name: 'Precision Hydraulic & Mechanical',
    unit_of_measure: 'units',
    cost_price: 3400.00,
    unit_price: 5200.00,
    reorder_level: 25,
    target_stock_level: 100,
    is_perishable: false,
    total_on_hand: 18,
    stock_status: 'CRITICAL_LOW'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000006',
    sku: 'SKU-PUMP-ROT-02',
    name: 'Rotary Gear Lubrication Pump',
    description: 'Self-priming positive displacement external gear pump for hydraulic oil circuits',
    category_id: 'c0000000-0000-0000-0000-000000000003',
    category_name: 'Precision Hydraulic & Mechanical',
    unit_of_measure: 'units',
    cost_price: 4800.00,
    unit_price: 7100.00,
    reorder_level: 15,
    target_stock_level: 60,
    is_perishable: false,
    total_on_hand: 8,
    stock_status: 'CRITICAL_LOW'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000007',
    sku: 'SKU-LUB-SYN-20',
    name: 'Synthetic Polyalphaolefin Gear Oil 20L',
    description: 'Extreme-pressure synthetic lubricant with high thermal stability and oxidation resistance',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    category_name: 'Specialty Industrial Chemicals',
    unit_of_measure: 'canisters',
    cost_price: 2200.00,
    unit_price: 3150.00,
    reorder_level: 40,
    target_stock_level: 150,
    is_perishable: true,
    shelf_life_days: 730,
    total_on_hand: 22,
    stock_status: 'CRITICAL_LOW'
  },
  {
    product_id: 'e0000000-0000-0000-0000-000000000008',
    sku: 'SKU-REAG-CLEAN-5',
    name: 'Bio-Degradable Ultrasonic Degreaser 5L',
    description: 'Aqueous neutral solvent formulated for precision ultrasonic parts cleaning',
    category_id: 'c0000000-0000-0000-0000-000000000004',
    category_name: 'Specialty Industrial Chemicals',
    unit_of_measure: 'bottles',
    cost_price: 600.00,
    unit_price: 950.00,
    reorder_level: 50,
    target_stock_level: 200,
    is_perishable: false,
    total_on_hand: 0,
    stock_status: 'OUT_OF_STOCK'
  }
];

export const MOCK_BATCHES: InventoryBatch[] = [
  {
    batch_id: '70000000-0000-0000-0000-000000000001',
    batch_number: 'BATCH-2026-EL01',
    product_id: 'e0000000-0000-0000-0000-000000000001',
    product_name: 'STM32F4 Cortex-M4 Microcontroller',
    sku: 'SKU-STM32-01',
    warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_name: 'Bangalore Central Hub',
    initial_quantity: 1000,
    current_quantity: 840,
    unit_cost: 450.00,
    manufacturing_date: '2025-12-01',
    received_at: '2026-01-15T09:00:00Z',
    risk_tier: 'SAFE'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000002',
    batch_number: 'BATCH-2026-SEN01',
    product_id: 'e0000000-0000-0000-0000-000000000002',
    product_name: 'BMP280 Digital Barometric Pressure Sensor',
    sku: 'SKU-SENS-BMP280',
    warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_name: 'Bangalore Central Hub',
    initial_quantity: 600,
    current_quantity: 480,
    unit_cost: 120.00,
    manufacturing_date: '2025-11-15',
    received_at: '2026-01-10T11:00:00Z',
    risk_tier: 'SAFE'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000003',
    batch_number: 'BATCH-2026-VAX-A',
    product_id: 'e0000000-0000-0000-0000-000000000003',
    product_name: 'Cold-Chain mRNA Viral Vaccine Vial',
    sku: 'SKU-VAX-COV2',
    warehouse_id: 'b0000000-0000-0000-0000-000000000003',
    warehouse_name: 'Delhi NCR Cold Hub',
    initial_quantity: 250,
    current_quantity: 45,
    unit_cost: 850.00,
    manufacturing_date: '2026-01-01',
    expiry_date: '2026-11-16',
    received_at: '2026-01-18T14:30:00Z',
    days_until_expiry: 12,
    risk_tier: 'CRITICAL_UNDER_15_DAYS'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000004',
    batch_number: 'BATCH-2026-VAX-B',
    product_id: 'e0000000-0000-0000-0000-000000000003',
    product_name: 'Cold-Chain mRNA Viral Vaccine Vial',
    sku: 'SKU-VAX-COV2',
    warehouse_id: 'b0000000-0000-0000-0000-000000000003',
    warehouse_name: 'Delhi NCR Cold Hub',
    initial_quantity: 250,
    current_quantity: 220,
    unit_cost: 850.00,
    manufacturing_date: '2026-01-10',
    expiry_date: '2027-01-20',
    received_at: '2026-01-22T10:15:00Z',
    days_until_expiry: 78,
    risk_tier: 'SAFE'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000005',
    batch_number: 'BATCH-2026-INS-01',
    product_id: 'e0000000-0000-0000-0000-000000000004',
    product_name: 'Recombinant Human Insulin 100IU/ml',
    sku: 'SKU-INSULIN-100',
    warehouse_id: 'b0000000-0000-0000-0000-000000000003',
    warehouse_name: 'Delhi NCR Cold Hub',
    initial_quantity: 350,
    current_quantity: 190,
    unit_cost: 320.00,
    manufacturing_date: '2025-12-10',
    expiry_date: '2027-03-24',
    received_at: '2026-01-05T08:00:00Z',
    days_until_expiry: 140,
    risk_tier: 'SAFE'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000006',
    batch_number: 'BATCH-2026-VLV-01',
    product_id: 'e0000000-0000-0000-0000-000000000005',
    product_name: 'High-Pressure Hydraulic Directional Valve',
    sku: 'SKU-VALVE-HYD-50',
    warehouse_id: 'b0000000-0000-0000-0000-000000000002',
    warehouse_name: 'Mumbai Port Fulfillment',
    initial_quantity: 40,
    current_quantity: 18,
    unit_cost: 3400.00,
    manufacturing_date: '2025-10-01',
    received_at: '2025-10-20T16:00:00Z',
    risk_tier: 'SAFE'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000007',
    batch_number: 'BATCH-2026-PMP-01',
    product_id: 'e0000000-0000-0000-0000-000000000006',
    product_name: 'Rotary Gear Lubrication Pump',
    sku: 'SKU-PUMP-ROT-02',
    warehouse_id: 'b0000000-0000-0000-0000-000000000002',
    warehouse_name: 'Mumbai Port Fulfillment',
    initial_quantity: 20,
    current_quantity: 8,
    unit_cost: 4800.00,
    manufacturing_date: '2025-09-15',
    received_at: '2025-10-05T12:00:00Z',
    risk_tier: 'SAFE'
  },
  {
    batch_id: '70000000-0000-0000-0000-000000000008',
    batch_number: 'BATCH-2026-OIL-01',
    product_id: 'e0000000-0000-0000-0000-000000000007',
    product_name: 'Synthetic Polyalphaolefin Gear Oil 20L',
    sku: 'SKU-LUB-SYN-20',
    warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_name: 'Bangalore Central Hub',
    initial_quantity: 80,
    current_quantity: 22,
    unit_cost: 2200.00,
    manufacturing_date: '2025-08-01',
    expiry_date: '2028-04-05',
    received_at: '2025-08-15T10:00:00Z',
    days_until_expiry: 520,
    risk_tier: 'SAFE'
  }
];

export const MOCK_TRANSACTIONS: InventoryTransaction[] = [
  {
    transaction_id: 'tx-001',
    transaction_ref: 'TX-INIT-001',
    transaction_type: 'PO_RECEIPT',
    product_id: 'e0000000-0000-0000-0000-000000000001',
    product_name: 'STM32F4 Cortex-M4 Microcontroller',
    sku: 'SKU-STM32-01',
    warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_name: 'Bangalore Central Hub',
    batch_number: 'BATCH-2026-EL01',
    quantity_change: 1000,
    balance_after: 1000,
    performed_by: 'a0000000-0000-0000-0000-000000000003',
    performed_by_name: 'Nandan Kumar',
    notes: 'Initial PO-2026-001 fulfillment',
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    transaction_id: 'tx-002',
    transaction_ref: 'TX-ORD-901',
    transaction_type: 'SALE_FULFILLMENT',
    product_id: 'e0000000-0000-0000-0000-000000000001',
    product_name: 'STM32F4 Cortex-M4 Microcontroller',
    sku: 'SKU-STM32-01',
    warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_name: 'Bangalore Central Hub',
    batch_number: 'BATCH-2026-EL01',
    quantity_change: -160,
    balance_after: 840,
    performed_by: 'a0000000-0000-0000-0000-000000000003',
    performed_by_name: 'Nandan Kumar',
    notes: 'Client dispatch order SO-8842',
    created_at: '2026-01-20T14:30:00Z'
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    supplier_id: 'd0000000-0000-0000-0000-000000000001',
    supplier_code: 'SUP-SEMICORP',
    company_name: 'SemiTech Micro Devices Ltd',
    contact_name: 'Arjun Nair',
    email: 'arjun@semitech.co.in',
    phone: '+91-9876543210',
    address: 'Peenya Industrial Estate, Bangalore',
    rating: 4.85,
    lead_time_days: 5,
    payment_terms: 'Net 30',
    is_preferred: true,
    is_blacklisted: false
  },
  {
    supplier_id: 'd0000000-0000-0000-0000-000000000002',
    supplier_code: 'SUP-BIOLIFE',
    company_name: 'BioLife Pharma Solutions',
    contact_name: 'Dr. Sunita Rao',
    email: 'procurement@biolifepharma.com',
    phone: '+91-9812345678',
    address: 'Genome Valley, Hyderabad',
    rating: 4.90,
    lead_time_days: 3,
    payment_terms: 'Net 30',
    is_preferred: true,
    is_blacklisted: false
  },
  {
    supplier_id: 'd0000000-0000-0000-0000-000000000003',
    supplier_code: 'SUP-HYDROFLOW',
    company_name: 'HydroFlow Engineering Valves',
    contact_name: 'Vikram Patel',
    email: 'sales@hydroflowvalves.com',
    phone: '+91-9823456789',
    address: 'GIDC Industrial Zone, Vadodara',
    rating: 4.20,
    lead_time_days: 12,
    payment_terms: 'Net 45',
    is_preferred: false,
    is_blacklisted: false
  },
  {
    supplier_id: 'd0000000-0000-0000-0000-000000000004',
    supplier_code: 'SUP-CHEMPURE',
    company_name: 'ChemPure Reagents India',
    contact_name: 'Kavita Menon',
    email: 'orders@chempureindia.com',
    phone: '+91-9834567890',
    address: 'MIDC Tarapur, Maharashtra',
    rating: 3.75,
    lead_time_days: 15,
    payment_terms: 'Net 60',
    is_preferred: false,
    is_blacklisted: false
  }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    po_id: 'f0000000-0000-0000-0000-000000000001',
    po_number: 'PO-2026-001',
    supplier_id: 'd0000000-0000-0000-0000-000000000001',
    supplier_name: 'SemiTech Micro Devices Ltd',
    destination_warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    warehouse_name: 'Bangalore Central Hub',
    status: 'RECEIVED',
    total_amount: 450000.00,
    created_by: 'a0000000-0000-0000-0000-000000000002',
    creator_name: 'Priya Venkatesh',
    order_date: '2026-01-10',
    expected_delivery_date: '2026-01-16',
    actual_delivery_date: '2026-01-15',
    notes: 'Urgent semiconductor procurement'
  },
  {
    po_id: 'f0000000-0000-0000-0000-000000000002',
    po_number: 'PO-2026-002',
    supplier_id: 'd0000000-0000-0000-0000-000000000002',
    supplier_name: 'BioLife Pharma Solutions',
    destination_warehouse_id: 'b0000000-0000-0000-0000-000000000003',
    warehouse_name: 'Delhi NCR Cold Hub',
    status: 'RECEIVED',
    total_amount: 425000.00,
    created_by: 'a0000000-0000-0000-0000-000000000002',
    creator_name: 'Priya Venkatesh',
    order_date: '2026-01-15',
    expected_delivery_date: '2026-01-18',
    actual_delivery_date: '2026-01-18',
    notes: 'Cold-chain vaccine stock replenishment'
  },
  {
    po_id: 'f0000000-0000-0000-0000-000000000003',
    po_number: 'PO-2026-003',
    supplier_id: 'd0000000-0000-0000-0000-000000000003',
    supplier_name: 'HydroFlow Engineering Valves',
    destination_warehouse_id: 'b0000000-0000-0000-0000-000000000002',
    warehouse_name: 'Mumbai Port Fulfillment',
    status: 'ISSUED',
    total_amount: 170000.00,
    created_by: 'a0000000-0000-0000-0000-000000000002',
    creator_name: 'Priya Venkatesh',
    order_date: '2026-02-01',
    expected_delivery_date: '2026-02-14',
    notes: 'Q1 Hydraulic directional valve safety restock'
  }
];

export const MOCK_TRANSFERS: StockTransfer[] = [
  {
    transfer_id: '80000000-0000-0000-0000-000000000001',
    transfer_number: 'TRF-2026-001',
    source_warehouse_id: 'b0000000-0000-0000-0000-000000000001',
    source_warehouse_name: 'Bangalore Central Hub',
    target_warehouse_id: 'b0000000-0000-0000-0000-000000000002',
    target_warehouse_name: 'Mumbai Port Fulfillment',
    status: 'PENDING',
    requested_by: 'a0000000-0000-0000-0000-000000000003',
    requester_name: 'Nandan Kumar',
    approved_by: 'a0000000-0000-0000-0000-000000000002',
    approver_name: 'Priya Venkatesh',
    tracking_reference: 'BLR-EXP-7721',
    created_at: '2026-02-02T11:00:00Z',
    items: [
      {
        transfer_item_id: 'ti-01',
        transfer_id: '80000000-0000-0000-0000-000000000001',
        product_id: 'e0000000-0000-0000-0000-000000000001',
        product_name: 'STM32F4 Cortex-M4 Microcontroller',
        sku: 'SKU-STM32-01',
        source_batch_id: '70000000-0000-0000-0000-000000000001',
        source_batch_number: 'BATCH-2026-EL01',
        quantity: 50
      }
    ]
  }
];
