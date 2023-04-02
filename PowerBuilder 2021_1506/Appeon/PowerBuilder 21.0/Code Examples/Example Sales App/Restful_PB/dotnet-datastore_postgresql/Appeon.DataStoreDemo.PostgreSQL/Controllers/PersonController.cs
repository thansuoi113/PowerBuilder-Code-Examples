using SnapObjects.Data;
using DWNet.Data;
using Appeon.DataStoreDemo.PostgreSQL.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Http;

namespace Appeon.DataStoreDemo.PostgreSQL.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly IPersonService _personService;
        
        public PersonController(IPersonService perService)
        {
            _personService = perService;
        }
        
        // GET api/Person/WinOpen
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> WinOpen()
        {
            var packer = new DataPacker();
            
            try
            {
                packer.AddDataStore("Address",
                _personService.Retrieve("d_dddw_address"));
                packer.AddDataStore("AddressType",
                    _personService.Retrieve("d_dddw_addresstype"));
                packer.AddDataStore("PhonenumberType",
                    _personService.Retrieve("d_dddw_phonenumbertype"));
                packer.AddDataStore("CustomerTerritory",
                    _personService.Retrieve("d_dddw_territory"));
                packer.AddDataStore("Store",
                    _personService.Retrieve("d_dddw_store"));  
                packer.AddDataStore("Person", 
                    _personService.Retrieve("d_person_list", "IN"));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // GET api/Person/RetrievePersonByKey
        [HttpGet("{personId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> RetrievePersonByKey(int personId)
        {
            var packer = new DataPacker();
            try
            {
                packer.AddDataStore("Person",
                _personService.Retrieve("d_person", personId));
                packer.AddDataStore("Person.PersonAddress",
                    _personService.Retrieve("d_businessentityaddress", personId));
                packer.AddDataStore("Person.PersonPhone",
                    _personService.Retrieve("d_personphone", personId));
                packer.AddDataStore("Person.Customer",
                    _personService.Retrieve("d_customer", personId));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // POST api/Person/SavePerson
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> SavePerson(IDataUnpacker unpacker)
        {
            var packer = new DataPacker();
            
            try
            {
                var person = unpacker.GetDataStore("dw1", "d_person",MappingMethod.Key);
                var personAddress = unpacker.GetDataStore("dw2", "d_address",MappingMethod.Key);
                var personPhone = unpacker.GetDataStore("dw3", "d_personphone",MappingMethod.Key);
                var customer = unpacker.GetDataStore("dw4", "d_customer",MappingMethod.Key);
                
                var personId = _personService.SavePerson(person, personAddress, 
                    personPhone, customer);
                    
                if (personId > 0)
                {
                    packer.AddDataStore("Person", 
                        _personService.Retrieve("d_person", personId));
                    packer.AddDataStore("Person.PersonAddress", 
                        _personService.Retrieve("d_businessentityaddress", personId));
                    packer.AddDataStore("Person.PersonPhone", 
                        _personService.Retrieve("d_personphone", personId));
                    packer.AddDataStore("Person.Customer", 
                        _personService.Retrieve("d_customer", personId));
                }
                packer.AddValue("Status", "Success");
            }
            
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // POST api/Person/Savechanges
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> Savechanges(IDataUnpacker unpacker)
        {
            var packer = new DataPacker();
            
            var status = "Success";
            int? intPersonId = 0;
            
            try
            {
                var personAddress = unpacker.GetDataStore("dw1", "d_businessentityaddress",MappingMethod.Key);
                var personPhone = unpacker.GetDataStore("dw2", "d_personphone",MappingMethod.Key);
                var customer = unpacker.GetDataStore("dw3", "d_customer",MappingMethod.Key);
                
                if (personAddress.RowCount > 0)
                {
                    status = _personService.Update(true, personAddress);
                    intPersonId = personAddress.GetItem<int?>(0, "businessentityid");
                }
                
                if (personPhone.RowCount > 0 && status == "Success")
                {
                    status = _personService.Update(true, personPhone);
                    intPersonId = personPhone.GetItem<int?>(0, "businessentityid");
                }
                
                if (customer.RowCount > 0 && status == "Success")
                {
                    status = _personService.Update(true, customer);
                    intPersonId = customer.GetItem<int?>(0, "personid");
                    
                }
            
                if (status == "Success")
                {
                    packer.AddDataStore("Person", 
                        _personService.Retrieve("d_person", intPersonId));
                    packer.AddDataStore("Person.PersonAddress", 
                        _personService.Retrieve("d_businessentityaddress", intPersonId));
                    packer.AddDataStore("Person.PersonPhone", 
                        _personService.Retrieve("d_personphone", intPersonId));
                    packer.AddDataStore("Person.Customer", 
                        _personService.Retrieve("d_customer", intPersonId));
                }
                
                packer.AddValue("Status", status);
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            return packer;
        }
        
        // Delete api/Person/DeleteByKey
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IDataPacker> DeleteByKey(IDataUnpacker unpacker)
        {
            var packer = new DataPacker();
            
            var dwname = unpacker.GetValue<string>("arm1");
            var personId = unpacker.GetValue<int>("arm2");
            var status = "Success";
            
            try
            {
                switch (dwname)
                {
                    case "Person":
                    
                             
                        status = _personService.DeletePerson(personId);
                        
                        break;
                    case "PersonAddress":
                        var addressId = unpacker.GetValue<int>("arm3");
                        var addressTypeId = unpacker.GetValue<int>("arm4");
                        status = _personService.Delete("d_businessentityaddress", true,
                            "Addressid = " + addressId.ToString() + " And " +
                            "Addresstypeid = " + addressTypeId.ToString(),
                            personId);
                            
                        break;
                    case "PersonPhone":
                        var personNumber = unpacker.GetValue<string>("arm3");
                        var phonenumbertypeid = unpacker.GetValue<int>("arm4");
                        status = _personService.Delete("d_personphone", true,
                            "Phonenumber = '" + personNumber.ToString() + "' And " +
                            "Phonenumbertypeid = " + phonenumbertypeid.ToString(),
                            personId);
                            
                        break;
                    case "Customer":
                        var customerId = unpacker.GetValue<int>("arm3");
                        
                        status = _personService.Delete("d_customer", true, customerId);
                        
                        break;
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
            
            packer.AddValue("Status", status);
            
            return packer;
        }
    }
}