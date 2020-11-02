<template>
    <div style="height: 100%;">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="storageInCode" label="入库单单号" width="140">
            </el-table-column>
            <el-table-column prop="receiptType" label="入库类型" width="140">
            </el-table-column>
            <el-table-column prop="postingDate" label="过账日期" width="140">
            </el-table-column>
        </el-table>
        <el-divider content-position="left">明细列表</el-divider>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="receiptItemCode" label="关联单据明细单单号" width="140">
            </el-table-column>
            <el-table-column prop="materialCode" label="物料编码" width="140">
            </el-table-column>
            <el-table-column prop="materialName" label="物料名称" width="140">
            </el-table-column>
            <el-table-column prop="orderQty" label="订单数量" width="140">
            </el-table-column>
            <el-table-column prop="inventoryQty" label="已入库数量" width="140">
            </el-table-column>
            <el-table-column prop="departCode" label="采购部门" width="140">
            </el-table-column>
            <el-table-column prop="supplierCode" label="供货商" width="140">
            </el-table-column>
        </el-table>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="ftyCode" label="工厂" width="140">
            </el-table-column>
            <el-table-column prop="whCode" label="仓库号" width="140">
            </el-table-column>
            <el-table-column prop="materialName" label="物料名称" width="140">
            </el-table-column>
            <el-table-column prop="orderQty" label="订单数量" width="140">
            </el-table-column>
            <el-table-column prop="inventoryQty" label="已入库数量" width="140">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
        }
    }
}
</script>