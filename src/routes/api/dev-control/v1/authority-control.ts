import {createFileRoute} from "@tanstack/react-router";
import {licenseManagerRequest,requireDevControlOwner} from "@/lib/dev-control.server";
export const Route=createFileRoute("/api/dev-control/v1/authority-control")({server:{handlers:{
 GET:async({request})=>{try{requireDevControlOwner(request);return Response.json(await licenseManagerRequest("/authority-control"))}catch(error){return Response.json({ok:false,error:error instanceof Error?error.message:"Authority unavailable"},{status:502})}},
 PATCH:async({request})=>{try{requireDevControlOwner(request);const body=await request.json().catch(()=>({}));return Response.json(await licenseManagerRequest("/authority-control",{method:"PATCH",body:JSON.stringify(body)}))}catch(error){return Response.json({ok:false,error:error instanceof Error?error.message:"Authority control failed"},{status:502})}}
}}});
