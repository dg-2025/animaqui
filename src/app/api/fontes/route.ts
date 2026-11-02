import { listarFontesService } from '@/features/tipografia/services/fontesService';

export async function GET() {
  return Response.json(await listarFontesService());
}
