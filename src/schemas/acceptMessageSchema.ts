import {z} from "zod";

const AcceptMessageSchema = z.object({
    acceptMessages : z.boolean()
})