using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers
{
    
    public class TableHub : Hub
    {
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }

}