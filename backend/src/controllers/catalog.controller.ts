import { Request, Response } from 'express';
import { catalogData } from '../data/catalog.data.js';

export class CatalogController {
  public static getAll(_req: Request, res: Response) {
    return res.json({
      success: true,
      title: 'AGROVÉ 2026 Commercial Formulation Dossier',
      publishedYear: 2026,
      count: catalogData.length,
      data: catalogData
    });
  }

  public static exportSummary(_req: Request, res: Response) {
    const csvHeader = 'Code,Name,Category,Potency,DilutionRate,BasePriceINR\n';
    const csvRows = catalogData.map(c => `"${c.code}","${c.name}","${c.category}","${c.potency}","${c.dilutionRate}",${c.basePriceINR}`).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="AGROVE_2026_Catalog_Summary.csv"');
    return res.send(csvHeader + csvRows);
  }
}

