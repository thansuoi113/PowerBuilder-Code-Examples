using SnapObjects.Data;
using DWNet.Data;
using System;

namespace Appeon.DataStoreDemo.PostgreSQL.Services
{
    /// <summary>
    /// This Service needs to be injected into the ConfigureServices method of the Startup class. Sample code as follows:
    /// services.AddScoped<IProductService, ProductService>();
    /// </summary>
    public class ProductService : ServiceBase, IProductService
    {
        public ProductService(OrderContext context)
            : base(context)
        {
        }
        
        public void SaveProductPhoto(int productId, string photoname, byte[] photo)
        {
            _context.BeginTransaction();
            
            var productPhoto = new DataStore("d_productphoto", _context);
            productPhoto.AddRow();
            productPhoto.SetItem(0, "LargePhotoFileName", photoname);
            productPhoto.SetItem(0, "modifieddate", DateTime.Now);
            var result = productPhoto.Update();
            if (result == 1)
            {
                //Update LargePhoto
                var photoId = productPhoto.GetItem<int>(0, "ProductPhotoID");
                var sql = @"Update Production.ProductPhoto Set LargePhoto = :phote 
                            where ProductPhotoID = :photoId";
                _context.SqlExecutor.Execute(sql, photo, photoId);
                
                var pordProdPhoto = new DataStore("d_productproductphoto", _context);
                pordProdPhoto.AddRow();
                pordProdPhoto.SetItem(0, "ProductID", productId);
                pordProdPhoto.SetItem(0, "ProductPhotoID", photoId);
                pordProdPhoto.SetItem(0, "Primary_value", true);
                pordProdPhoto.SetItem(0, "modifieddate", DateTime.Now);
                
                pordProdPhoto.Update();
            }
            
            _context.Commit();
        }
        
        public string DeleteProduct(int productId)
        {
            string status = "Success";
            
            _context.BeginTransaction();
            
            status = Delete("d_productproductphoto", false, productId);
            status = Delete("d_history_price", false, productId);
            status = Delete("d_product_detail", false, productId);
            
            _context.Commit();
            
            return status;
        }
        
        public bool retrieveProductPhote(int productId, out string photoname, out byte[] photo)
        {
            var sql = @"Select ProductPhoto.LargePhotoFileName, ProductPhoto.LargePhoto
                       From  Production.ProductPhoto, Production.ProductProductPhoto
                       Where (ProductPhoto.ProductPhotoID = ProductProductPhoto.ProductPhotoID) 
                       And (ProductProductPhoto.ProductID = :proid) 
                       and (ProductProductPhoto.Primary_value = true)
                       Order By ProductPhoto.ModifiedDate desc limit 1";
                       
            var result = _context.SqlExecutor.Select<DynamicModel>(sql, productId);
            
            if (result.Count == 1)
            {
                var data = result[0];
                photoname = data.GetValue<string>("LargePhotoFileName");
                photo = data.GetValue<byte[]>("LargePhoto");
                
                return true;
            }
            else
            {
                photoname = null;
                photo = null;
                
                return false;
            }
        }
        
        public int SaveHistoryPrices(IDataStore subcate, IDataStore product, IDataStore prices)
        {
            int intSubCateId = 0;
            int intProductId = 0;
            
            _context.BeginTransaction();
            
            subcate.DataContext = _context;
            subcate.Update();
            
            intSubCateId = subcate.GetItem<int>(0, "productsubcategoryid");
            
            SetProductPrimaryKey(subcate, product);
            product.DataContext = _context;
            product.Update();
            
            intProductId = product.GetItem<int>(0, "productid");
            
            SetPricePrimaryKey(product, prices);
            prices.DataContext = _context;
            prices.Update();
            
            _context.Commit();
            
            return intSubCateId;
        }
        
        public int SaveProductAndPrice(IDataStore product, IDataStore prices)
        {
            int intProductId = 0;
            
            _context.BeginTransaction();
            
            product.DataContext = _context;
            product.Update();
            
            intProductId = product.GetItem<int>(0, "productid");
            
            SetPricePrimaryKey(product, prices);
            prices.DataContext = _context;
            prices.Update();
            
            _context.Commit();
            
            return intProductId;
        }
        
        private void SetPricePrimaryKey(IDataStore product, IDataStore prices)
        {
            if (product.DeletedCount == 0 && product.RowCount > 0)
            {
                var productId = product.GetItem<int>(0, "productid");
                
                for (int i = 0; i < prices.RowCount; i++)
                {
                    if (prices.GetRowStatus(i) == ModelState.NewModified)
                    {
                        prices.SetItem(i, "productid", productId);
                    }
                }
            }
        }
        
        private void SetProductPrimaryKey(IDataStore subcate, IDataStore product)
        {
            if (subcate.DeletedCount == 0 && subcate.RowCount > 0)
            {
                var subCateId = subcate.GetItem<int>(0, "productsubcategoryid");
                
                for (int i = 0; i < product.RowCount; i++)
                {
                    if (product.GetRowStatus(i) == ModelState.NewModified)
                    {
                        product.SetItem(i, "productsubcategoryid", subCateId);
                    }
                }
            }
        }
    }
}
