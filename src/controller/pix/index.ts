import { PgPagamento } from "./PixController/create"
import { Get } from "./PixController/getDados"
import { DataSave } from "./PixController/savedata"
import { VerifyPagamento } from "./PixController/verify"


const PixController = {
    PgPagamento,
    VerifyPagamento,
    DataSave,
    Get
}

export default PixController