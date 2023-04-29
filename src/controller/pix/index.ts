import { CreatePg } from "./PixController/create/create"
import { Get } from "./PixController/getDados"
import { DataSave } from "./PixController/savedata"
import { VerifyPagamento } from "./PixController/verify"


const PixController = {
    VerifyPagamento,
    DataSave,
    Get,
    CreatePg
}

export default PixController