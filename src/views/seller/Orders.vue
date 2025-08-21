<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-md">Order Management</div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Order Management</div>
        <div class="text-subtitle2 text-grey-7">Track your business performance</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Orders Overview</div>
                <div class="text-subtitle2 text-grey-7">Latest order updates</div>
              </q-card-section>
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-card>
                      <q-card-section>
                        <div class="text-h6">Recent Orders</div>
                        <div class="text-subtitle2 text-grey-7">Track new sales</div>
                      </q-card-section>
                      <!-- Example content -->
                      <q-card-section>
                        <div class="row">
                          <div class="col-12">
                            <q-table
                              :rows="orders"
                              :columns="columns"
                              row-key="id"
                              flat
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "OrdersPage",
  data() {
    return {
      columns: [
        { name: "id", label: "Order ID", field: "id", align: "left" },
        { name: "customer", label: "Customer", field: "customer", align: "left" },
        { name: "amount", label: "Amount", field: "amount", align: "right" },
        { name: "status", label: "Status", field: "status", align: "left" }
      ],
      orders: [
        { id: 1, customer: "Ali", amount: "$250", status: "Shipped" },
        { id: 2, customer: "Hamza", amount: "$120", status: "Pending" },
        { id: 3, customer: "Sara", amount: "$540", status: "Delivered" }
      ]
    };
  }
};
</script>
